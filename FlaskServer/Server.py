import base64
from flask import Flask, request, jsonify, json
import mysql.connector
import requests
from datetime import datetime


app = Flask(__name__)
# Detetction creates the id and saves itto database, then we use it for all requests
count = 0
users = []

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='owlsys', user='owlsys', password='admin')
except Exception as e:
    print(e)


@app.route('/accept', methods=['POST'])
def handleAccept():
    try:
        content = request.json
        # add the content to database

        return jsonify({"result": 1, "alertid": content.get('alertId')})
    except Exception as e:
        return jsonify({'result': -1, 'messgae': e})


@app.route('/resolve', methods=['POST'])
def handleResolve(userId, alertId):
    print("resloved--> userId:{}  alertId:{}", userId, alertId)
    return jsonify({"result": 1})


def sendAlert(token, cam, floor):
    global count
    count += 1
    message = {
        "to": token,
        "sound": 'default',
        "title": 'Violenece Detected',
        "body": "cam: {} floor: {}".format(cam, floor),
        "data":
        {
            "id": count,
            "cam": cam,
            "floor": floor,
            "pic": 1,
            "respondents": 2
        },
    }
    response = requests.post(
        'https://exp.host/--/api/v2/push/send', json=message)
    return response.content


@app.route('/alert', methods=['POST'])
def getAlert():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    cam = user_json['cam']
    floor = user_json['floor']
    try:
        for user in users:
            print(user["token"])
            sendAlert(user["token"], cam, floor)
        return jsonify({"message": "Data received successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "----SERVER ERROR: JSON OR PUSH NOTIFICATION------"})


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


@app.route("/alertImage")
def sendAlertImage():
    with open("C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

    alertImage = {
        "image": encoded_string,
    }
    return jsonify({"alert": alertImage})


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
