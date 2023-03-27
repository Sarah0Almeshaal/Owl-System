import base64
from flask import Flask, request, jsonify, json
import mysql.connector
import requests
import time
import os
import datetime
from datetime import datetime, timedelta

app = Flask(__name__)
users = []
alerts = []
unresolvedTimeInMinutes = 10
# average Number of users
numberOfAccept = int(len(users)/2)
# store all images captured with its alert ids
imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/"

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='owlsys', user='owlsys', password='admin')
except Exception as e:
    print(e)


def isUnresolved(timestamp):
    # convert string timestamp to datetime object and compare if specific time has passed
    f = '%Y-%m-%d %H:%M:%S'
    # increment timestamp by the specified timer
    t = datetime.strptime(timestamp, f) + timedelta(minutes=unresolvedTimeInMinutes)
    n = datetime.now()
    return t<n


def isResolved(alertId):
    # loop through alerts to find alertId
    for alert in alerts:
        if alert["id"] == alertId:
            # increment counter by 1
            alert["count"]+=1
            # check if counter equals to specified number (considered resolved)
            if alert["count"]>=numberOfAccept:
                # update alert table alert.status = reolved
                query = "UPDATE alert SET Status = 'Resolved' WHERE alert.ID = %s;"
                cursor = connection.cursor()
                cursor.execute(query,(str(alert["id"])))
                connection.commit()
                # remove alert from alert array
                alerts.remove(alert)
                break

def checkAlertsStatus():
    # setInterval every (unresolvedTimeInMinutes)
    # loop through array
    for a in alerts:
        # check for each alert the timestamp call isUnresolved
        if not isUnresolved(a["time"]):
        # change alert status to = unresolved
            query = "UPDATE alert SET Status = 'Unresolved' WHERE alert.ID = %s;"
            cursor = connection.cursor()
            cursor.execute(query,(str(a["id"])))
            # remove alert from array
            alerts.remove(a)
    connection.commit()

def isAlertUnresolved(id):
    # loop through array
    for a in alerts:
        if alerts["id"]==id:
            # alert the timestamp call isUnresolved
            if not isUnresolved(a["time"]):
            # change alert status to = unresolved
                query = "UPDATE alert SET Status = 'Unresolved' WHERE alert.ID = %s;"
                cursor = connection.cursor()
                cursor.execute(query,(str(a["id"])))
                # remove alert from array
                alerts.remove(a)
                connection.commit()
                return True
    return False


@app.route('/getAlerts',methods=['POST'])
def getAlerts():
    content = request.json
    userId = content.get('userId')
    # get alerts with a pending status
    try:
        select_data = ( "SELECT alert.ID as alertId, camera.Id as camId, camera.floor "
                        "FROM alert "
                        "INNER JOIN send ON alert.ID=send.alertID "
                        "INNER JOIN camera ON send.camIP=camera.camIP "
                        "WHERE alert.Status = 'pending';")
        cursor = connection.cursor()
        cursor.execute(select_data)
        records = cursor.fetchall()
        alertList=[]
        for row in records:
            if not isAlertUnresolved(row[0]):
                item = {}
                item["alertId"] = row[0]
                item["camId"] = row[1]
                item["floor"] = row[2]
                # check if user already Accepted the alert
                query= ("SELECT COUNT(*) FROM owlsys.receive WHERE userID = %s AND alertID = %s;")
                cursor.execute(query,(str(userId),str(item["alertId"])))
                records = cursor.fetchall()
                isUserAccepted = records[0][0]   
                if isUserAccepted == 0:                   
                    # Respondents
                    query= ("SELECT count(*) "
                                "FROM receive " 
                                "WHERE receive.alertID = %s;")
                    cursor.execute(query,(str(item["alertId"]),))
                    records = cursor.fetchall()
                    responsCount = records[0][0]
                    item["respondents"] = responsCount
                    # get image as string and store encoded image
                    alertImage = getAlertImage(item["alertId"])
                    item["alertImage"] = alertImage
                    #append dictionary to the list
                    alertList.append(item)
        jsonString = json.dumps(alertList)
        return jsonify({"alertList":jsonString,"result":1})
    except Exception as e:
        return jsonify({"message":e,"result":-1})


@app.route('/accept',methods=['POST'])
def handleAccept():
    try:
        # get userID and alertID
        content = request.json
        alertId = content.get('alertId')
        userId = content.get('userId')
        # create recieveRecord inserting userID and AlertID
        try:
            insert_data = "INSERT INTO receive (userID,alertID) VALUES (%s,%s)"
            cursor = connection.cursor()
            cursor.execute(insert_data,(str(userId),str(alertId)))
            connection.commit()
            # change alert status depending on How many Accept needed for it to change
            isResolved(alertId)
        except mysql.connector.Error as e:
            return jsonify({"message":e.msg,"result":-1})
        return jsonify({"result": 1,"alertId":alertId,"userId":userId})
    except Exception as e:
        return jsonify({'result': -1, 'messgae': e})


# push notification
def sendPushNotification(token,cam,floor):
    message = {
        "to": token,
        "sound": 'default',
        "title": 'Violenece Detected',
        "body": "cam: {} floor: {}".format(cam,floor),
        "_contentAvailable": True,
    }
    response = requests.post(
        'https://exp.host/--/api/v2/push/send', json=message)
    return response.content


@app.route('/alert', methods=['POST'])
def getAlert():
    data = request.get_json()
    data_str = json.dumps(data)
    data_json = json.loads(data_str)
    cam = data_json['cam']
    floor = data_json['floor']
    timestamp = data_json['timestamp']
    # 1/ create alertRecord inserting pending status
    try:
        query = "INSERT INTO alert (Status) VALUES ('pending')"
        cursor = connection.cursor()
        cursor.execute(query)
        #2/ retieve the alertRecord ID
        alertId = cursor.lastrowid
        if alertId != 0:
            # append alert info to Alerts array --> to check for resolved/unresolved later on
            alerts.append({"id":alertId,"time":timestamp,"count":0})
            #3/create sendRecord inserting the retrieved alertID and Json Info 
            try:
                insert_data = "INSERT INTO send VALUES (%s,%s,%s)"
                cursor.execute(insert_data,(str(cam),str(alertId),timestamp))
                connection.commit()
            except mysql.connector.Error as e:
                return jsonify({"message":e.msg,"result":-1})
            for user in users:
                # 4/ push notification
                sendPushNotification(user["token"],cam,floor)
            return jsonify({"message": "Data inserted successfully","alertId":alertId,"result": 1})
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
        return jsonify({"message":e.msg,"result":-1})
    finally:
        cursor.close()
    
def getAlertImage(alertId):
    try:
        for root, dirs, files in os.walk(imageDirectory):
            for file in files:
                if(int(file.replace(".jpg",""))==alertId):
                    # already found the file name === the alert ID
                    with open(os.path.join(imageDirectory,file), "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    return encoded_string
    except Exception as e:
        return e

# -----------------------------------

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    password = user_json['password']
    token = user_json['token']
    try:
        sqlQuery = "SELECT id, password, type FROM user where  Password='" + \
            password + "' and id = " + str(id)

        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        userType = cursor.fetchone()
        if cursor.rowcount > 0:
            if userType[2] == "Admin":
                return jsonify({"result": "Admin"})
            else:
                user = {
                    "id": id,
                    "token": token
                }
                users.append(user)
            return jsonify({"result": "Security Guard"})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)

@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    for user in users:
        if (user.id == id):
            users.remove(user)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})


@app.route('/addCamera', methods=['POST'])
def addCamera():
    content = request.json
    cameraNum = content.get("cameraNo")
    cameraIp = content.get("cameraIp")
    cameraFloor = content.get("cameraFloor")
    adminId = content.get("adminId")
    try:
        sqlQuery = "INSERT INTO Camera (Id, CamIP, floor, user_Id) VALUES (%s, %s, %s, %s)"
        cursor = connection.cursor()
        cursor.execute(sqlQuery, (str(cameraNum), str(
            cameraIp), str(cameraFloor), str(adminId)))
        connection.commit()
        return jsonify({"result": 1})
    except mysql.connector.Error as e:
        print("Error inserting data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/getAlertCount', methods=['GET'])
def getAlertCount():
    try:
        sqlQuery = "SELECT CAST(timestamp AS DATE) AS alertDate, COUNT(timestamp) AS counter FROM send WHERE timestamp > (CURDATE() - INTERVAL 80 DAY) group by CAST(timestamp AS DATE)"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        alerts = cursor.fetchall()
        alertList = []
        if cursor.rowcount > 0:
            for alert in alerts:
                date = alert[0].strftime('%Y-%m-%d')
                alertDetails = {
                    "Date": date,
                    "Counter": alert[1],
                }
                alertList.append(alertDetails)
            return jsonify({"alerts": alertList})
        else:
            return jsonify({"alerts": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/deleteCamera', methods=['POST'])
def deleteCamera():
    content = request.json
    cameraNum = content.get("cameraNum")
    try:
        sqlQuery = """Delete from Camera where Id = %s"""
        cursor = connection.cursor()
        cursor.execute(sqlQuery, (cameraNum,))
        connection.commit()
        return jsonify({"result": 1})
    except mysql.connector.Error as e:
        print("Error deleting data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/getData', methods=['GET'])
def getData():
    try:
        sqlQuery = "SELECT id, floor FROM CAMERA"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        camerasRecords = cursor.fetchall()
        cameraList = []
        if cursor.rowcount > 0:
            for record in camerasRecords:
                camera = {
                    "id": record[0],
                    "floor": record[1]
                }
                cameraList.append(camera)
            return jsonify({"cameraList": cameraList})
        else:
            return jsonify({"cameraList": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
