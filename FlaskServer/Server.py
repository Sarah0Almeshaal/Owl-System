import base64
from flask import Flask, request, jsonify, json
import mysql.connector
import requests
import os
import datetime
from datetime import datetime, timedelta

app = Flask(__name__)
users = []
alerts = []
unresolvedTimeInMinutes = 5
# average Number of users
numberOfAccept = int(len(users)/2)
# store all images captured with its alert ids
# imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/"

imageDirectory = "C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Saved Frames/"

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='owlsys', user='owlsys', password='admin')
except Exception as e:
    print(e)


def isUnresolved(timestamp):
    # convert string timestamp to datetime object and compare if specific time has passed
    f = '%Y-%m-%d %H:%M:%S'
    # increment timestamp by the specified timer
    t = datetime.strptime(timestamp, f) + \
        timedelta(minutes=unresolvedTimeInMinutes)
    n = datetime.now()
    return t < n


def isResolved(alertId):
    id = -1
    # loop through alerts to find alertId
    for alert in alerts:
        if alert["id"] == alertId:
            # increment counter by 1
            alert["count"] += 1
            # check if counter equals to specified number (considered resolved)
            if alert["count"] >= numberOfAccept:
                id = alert["id"]
                # remove alert from alert array
                alerts.remove(alert)
                break
    if id != -1:
        # update alert table alert.status = reolved
        query = "UPDATE alert SET Status = 'Resolved' WHERE alert.ID = %s;"
        cursor = connection.cursor()
        cursor.execute(query, (str(id)))
        connection.commit()


def checkAlertStatus():
    # setInterval every (unresolvedTimeInMinutes)
    # loop through array
    for a in alerts:
        # check for each alert the timestamp call isUnresolved
        if not isUnresolved(a["time"]):
            # change alert status to = unresolved
            query = "UPDATE alert SET Status = 'Unresolved' WHERE alert.ID = %s;"
            cursor = connection.cursor()
            cursor.execute(query, (str(a["id"])))
            # remove alert from array
            alerts.remove(a)
    connection.commit()


@app.route('/getAlerts', methods=['POST'])
def getAlerts():
    content = request.json
    userId = content.get('userId')
    # get alerts with a pending status
    try:
        select_data = ("SELECT alert.ID as alertId, camera.Id as camId, camera.floor "
                       "FROM alert "
                       "INNER JOIN send ON alert.ID=send.alertID "
                       "INNER JOIN camera ON send.camIP=camera.camIP "
                       "WHERE alert.Status = 'pending';")
        cursor = connection.cursor()
        cursor.execute(select_data)
        records = cursor.fetchall()
        alertList = []
        for row in records:
            item = {}
            item["alertId"] = row[0]
            item["camId"] = row[1]
            item["floor"] = row[2]
            # check if user already Accepted the alert
            query = (
                "SELECT COUNT(*) FROM owlsys.receive WHERE userID = %s AND alertID = %s;")
            cursor.execute(query, (str(userId), str(item["alertId"])))
            records = cursor.fetchall()
            isUserAccepted = records[0][0]
            if isUserAccepted == 0:
                # Respondents
                query = ("SELECT count(*) "
                         "FROM receive "
                         "WHERE receive.alertID = %s;")
                cursor.execute(query, (str(item["alertId"]),))
                records = cursor.fetchall()
                responsCount = records[0][0]
                item["respondents"] = responsCount
                # get image as string and store encoded image
                alertImage = getAlertImage(item["alertId"])
                item["alertImage"] = alertImage
                # append dictionary to the list
                alertList.append(item)
        jsonString = json.dumps(alertList)
        return jsonify({"alertList": jsonString, "result": 1})

    except Exception as e:
        return jsonify({"message": e, "result": -1})


@app.route('/accept', methods=['POST'])
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
            cursor.execute(insert_data, (str(userId), str(alertId)))
            connection.commit()
            # ------------>>>>>>>>Incomplete Task------------------
            # change alert status depending on How many Accept needed for it to change
            # get count of users Accepted the alert
            # If >= specified amount then change Alert Status to Resolved!!!
        except mysql.connector.Error as e:
            return jsonify({"message": e.msg, "result": -1})
        return jsonify({"result": 1, "alertId": alertId, "userId": userId})
    except Exception as e:
        return jsonify({'result': -1, 'messgae': e})


# push notification
def sendPushNotification(token, cam, floor):
    message = {
        "to": token,
        "sound": 'default',
        "title": 'Violenece Detected',
        "body": "cam: {} floor: {}".format(cam, floor),
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
        # 2/ retieve the alertRecord ID
        alertId = cursor.lastrowid
        if alertId != 0:
            # append alert info to Alerts array --> to check for resolved/unresolved later on
            # alerts.append({"id":alertId,"time":timestamp,"count":0})
            # 3/create sendRecord inserting the retrieved alertID and Json Info
            try:
                insert_data = "INSERT INTO send VALUES (%s,%s,%s)"
                cursor.execute(
                    insert_data, (str(cam), str(alertId), timestamp))
                connection.commit()
            except mysql.connector.Error as e:
                return jsonify({"message": e.msg, "result": -1})
            for user in users:
                # 4/ push notification
                sendPushNotification(user["token"], cam, floor)
            return jsonify({"message": "Data inserted successfully", "alertId": alertId, "result": 1})
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
        return jsonify({"message": e.msg, "result": -1})
    finally:
        cursor.close()


def getAlertImage(alertId):
    try:
        for root, dirs, files in os.walk(imageDirectory):
            for file in files:
                if (int(file.replace(".jpg", "")) == alertId):
                    # already found the file name === the alert ID
                    with open(os.path.join(imageDirectory, file), "rb") as image_file:
                        encoded_string = base64.b64encode(
                            image_file.read()).decode('utf-8')
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
    cameraNum = content.get("cameraNum")
    cameraIp = content.get("cameraIp")
    cameraFloor = content.get("cameraFloor")
    adminId = content.get("adminId")
    try:
        sqlQuery = "INSERT INTO Camera (Id, CamIP, floor, user_Id) VALUES (%s, %s, %s, %s)"
        cursor = connection.cursor()
        cursor.execute(sqlQuery, (int(cameraNum), str(
            cameraIp), str(cameraFloor), str(adminId)))
        connection.commit()
        return jsonify({"result": 1})
    except mysql.connector.Error as e:
        print("Error inserting data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/getAlertRecord', methods=['GET'])
def getAlertRecord():
    try:
        sqlQuery = "SELECT CAST(timestamp AS DATE) AS alertDate, COUNT(timestamp) AS counter FROM send WHERE timestamp > (CURDATE() - INTERVAL 80 DAY) group by CAST(timestamp AS DATE)"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        alerts = cursor.fetchall()
        alertList = []

        sqlQueryResolved = "SELECT alertID, COUNT(*) FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.alertID = owlsys.alert.id WHERE Status = 'resolved' AND DATE(timestamp) = curdate();"
        cursor.execute(sqlQueryResolved)
        resolved = cursor.fetchone()

        sqlQueryUnresolved = "SELECT alertID, COUNT(*) FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.alertID = owlsys.alert.id WHERE Status = 'unresolved' AND DATE(timestamp) = curdate();"
        cursor.execute(sqlQueryUnresolved)
        unresolved = cursor.fetchone()

        if cursor.rowcount > 0:
            counter = {
                "resolved": resolved[1],
                "unresolved": unresolved[1]
            }

            for alert in alerts:
                date = alert[0].strftime('%Y-%m-%d')
                alertDetails = {
                    "date": date,
                    "count": alert[1],
                }

                alertList.append(alertDetails)
            return jsonify({"alerts": alertList}, {"counter": counter})
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


@app.route('/getCamerasData', methods=['GET'])
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


@app.route('/getAlertLog', methods=['GET'])
def getAlertLogData():
    try:
        sqlQuery = "SELECT alert.ID, alert.Status, send.timestamp  FROM alert, send WHERE alert.id = send.alertID"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        AlertLogRecords = cursor.fetchall()
        AlertLog = []
        if cursor.rowcount > 0:
            for record in AlertLogRecords:
                date = record[2].strftime('%Y-%m-%d')
                time = record[2].strftime("%H:%M:%S")

                log = {
                    "id": record[0],
                    "status": record[1],
                    "date": date,
                    "time": time
                }
                AlertLog.append(log)
            return jsonify({"AlertLog": AlertLog})
        else:
            return jsonify({"AlertLog": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/getLastCamera', methods=['GET'])
def getLastCamera():
    try:
        sqlQuery = "select id from owlsys.camera ORDER BY id DESC LIMIT 1;"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        cameraLastRow = cursor.fetchone()
        if cursor.rowcount > 0:
            return jsonify({"cameraLastRow": cameraLastRow})
        else:
            return jsonify({"cameraLastRow": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/alertDetails', methods=['POST'])
def alertDetails():
    try:
        content = request.json
        alertId = content.get('alertId')

        alertDetailsQuery = """SELECT alertID, Status, timestamp, owlsys.camera.Id, floor FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.alertID = owlsys.alert.ID INNER JOIN owlsys.camera ON owlsys.camera.camIP = owlsys.send.camIP WHERE alertID = %s ;"""
        detailsCursor = connection.cursor()
        detailsCursor.execute(alertDetailsQuery, (alertId,))
        details = detailsCursor.fetchone()

        respondentsDetailsQuery = """SELECT owlsys.user.ID, Fname, Lname FROM owlsys.receive INNER JOIN owlsys.user ON owlsys.receive.userID = owlsys.user.ID WHERE alertID = %s ;"""
        respondentsCursor = connection.cursor()
        respondentsCursor.execute(respondentsDetailsQuery, (alertId,))
        respondentRecord = respondentsCursor.fetchall()
        respondents = []

        try:
            path = "C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Saved Frames/" + \
                str(alertId)+".jpg"
            with open(path, "rb") as image_file:
                encoded_string = base64.b64encode(
                    image_file.read()).decode('utf-8')
        except FileNotFoundError as e:
            print(e)

        if detailsCursor.rowcount > 0:
            date = details[2].strftime('%Y-%m-%d')
            time = details[2].strftime("%H:%M:%S")
            print(details[1])
            alertDetails = {
                "status": details[1],
                "date": date,
                "time": time,
                "camId": details[3],
                "floor": details[4],
                "image": encoded_string
            }

            for record in respondentRecord:
                respondent = {
                    "id": record[0],
                    "fname": record[1],
                    "lname": record[2]
                }
                respondents.append(respondent)

        return jsonify({"alertDetails": alertDetails}, {"respondents": respondents})

    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route('/image', methods=['POST'])
def getAlertImage():
    try:
        alertId = 40
        path = "C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Saved Frames/image.jpg"
        with open(path, "rb") as image_file:
            encoded_string = base64.b64encode(
                image_file.read()).decode('utf-8')
            return jsonify({"image": encoded_string})
    except FileNotFoundError as e:
         return jsonify({"error": e})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
