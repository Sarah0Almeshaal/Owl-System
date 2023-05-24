import base64
import cv2
from flask import Flask, request, jsonify, json
import mysql.connector
import requests
import os
import datetime
from datetime import datetime, timedelta
from PIL import Image
from io import BytesIO

app = Flask(__name__)
users = []
unresolvedTimeInMinutes = 7
# average Number of users
numberOfAccept = int(len(users) / 2)


# Used for image search and retrieval
# imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/ViolenceDetectionModel/Violence Image/"

imageDirectory = "C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Violence Image/"

try:
    connection = mysql.connector.connect(
        host="localhost", database="owlsys", user="owlsys", password="admin"
    )
    connection.autocommit(True)
except Exception as e:
    print(e)


def getResponseCount(alertId):
    query = "SELECT count(*) " "FROM receive " "WHERE receive.AlertID = %s;"
    cursor = connection.cursor()
    cursor.execute(query, (str(alertId),))
    records = cursor.fetchall()
    return int(records[0][0])


def isResolved(alertId):
    # check if counter equals to specified number (considered resolved)
    if getResponseCount(alertId) >= numberOfAccept:
        try:
            # update alert table alert.status = reolved
            query = "UPDATE alert SET Status = 'Resolved' WHERE alert.ID = %s;"
            cursor = connection.cursor()
            cursor.execute(query, (str(alertId),))
            connection.commit()
        except mysql.connector.Error as e:
            print(e)
            return -1
        finally:
            cursor.close()


def isUnresolved(timestamp):
    # convert string timestamp to datetime object and compare if specific time has passed
    f = "%Y-%m-%d %H:%M:%S"
    # increment timestamp by the specified timer
    t = datetime.strptime(timestamp, f) + timedelta(minutes=unresolvedTimeInMinutes)
    n = datetime.now()
    return t < n


def isAlertUnresolved(id, time):
    # alert the timestamp call isUnresolved
    if isUnresolved(time):
        # at least one respondent
        if getResponseCount(id) > 0:
            query = "UPDATE alert SET alert.Status = 'Resolved' WHERE alert.ID=%s;"
        else:
            # no response and time expired
            query = "UPDATE alert SET alert.Status = 'Unresolved' WHERE alert.ID=%s;"
        cursor = connection.cursor()
        cursor.execute(query, (str(id),))
        connection.commit()
        return True
    return False


def isUserAlreadyAccepted(userId, alertId):
    try:
        # check if user already Accepted the alert
        query = (
            "SELECT COUNT(*) FROM owlsys.receive WHERE UserID = %s AND AlertID = %s;"
        )
        cursor = connection.cursor()
        cursor.execute(query, (str(userId), str(alertId)))
        records = cursor.fetchall()
        return records[0][0]
    except Exception as e:
        print(e)
        return -1
    finally:
        cursor.close()


@app.route("/getAlerts", methods=["POST"])
def getAlerts():
    content = request.json
    userId = content.get("userId")
    # get alerts with a pending status
    try:
        select_data = (
            "SELECT alert.ID as alertId, camera.Id as camId, camera.floor,send.timestamp "
            "FROM alert "
            "INNER JOIN send ON alert.ID=send.AlertID "
            "INNER JOIN camera ON send.CamID=camera.ID "
            "WHERE alert.Status = 'pending';"
        )
        cursor = connection.cursor()
        cursor.execute(select_data)
        records = cursor.fetchall()
        cursor.close()
        alertList = []
        for row in records:
            if not isAlertUnresolved(row[0], str(row[3])):
                item = {}
                item["alertId"] = row[0]
                item["camId"] = row[1]
                item["floor"] = row[2]
                # check if user already Accepted the alert
                isUserAccepted = isUserAlreadyAccepted(userId, item["alertId"])
                if isUserAccepted == 0 | isUserAccepted != -1:
                    item["respondents"] = getResponseCount(item["alertId"])
                    # get image as string and store encoded image
                    alertImage = getAlertImage(item["alertId"])
                    item["alertImage"] = alertImage
                    # append dictionary to the list
                    alertList.append(item)
        jsonString = json.dumps(alertList)
        return jsonify({"alertList": jsonString, "result": 1})
    except Exception as e:
        return jsonify({"message": e, "result": -1})


@app.route("/accept", methods=["POST"])
def handleAccept():
    try:
        content = request.json
        alertId = content.get("alertId")
        userId = content.get("userId")
        print("user id is",userId)
        if insertNewRecieveRecord(userId, alertId) == -1:
            return jsonify({"message": "error inserting recieve record", "result": -1})
        # change alert status depending on How many Accept needed for it to change
        if isResolved(alertId) == -1:
            return jsonify({"message": "error in checking isResolved", "result": -1})
        return jsonify({"result": 1, "alertId": alertId, "userId": userId})
    except Exception as e:
        return jsonify({"result": -1, "messgae": e})


def insertNewRecieveRecord(userId, alertId):
    try:
        insert_data = "INSERT INTO receive (UserID,AlertID) VALUES (%s,%s)"
        cursor = connection.cursor()
        cursor.execute(insert_data, (str(userId), str(alertId)))
        connection.commit()
    except mysql.connector.Error as e:
        print(e.msg)
        return -1
    finally:
        cursor.close()


@app.route("/alert", methods=["POST"])
def handlIncomingAlerts():
    data = request.get_json()
    data_str = json.dumps(data)
    data_json = json.loads(data_str)
    cameraName = data_json["camName"]
    timestamp = data_json["timestamp"]
    alertImage = data_json["DetectedImage"]
    # Get Camera Information (Id and Floor)
    CamInfo = getCameraInfo(cameraName)
    # No camera Found
    if CamInfo == -1:
        return jsonify({"result": -1, "msg": "camera info error"})
    camID = CamInfo["id"]
    floor = CamInfo["floor"]
    try:
        alertId = insertNewAlertRecord()
        if alertId == -1:
            return jsonify({"result": -1, "msg": "alert record error"})
        if insertSendRecord(camID, alertId, timestamp) == -1:
            return jsonify({"result": -1, "msg": "send record error"})
        # for each logged user send push notification
        for user in users:
            sendPushNotification(user["token"], camID, floor)
        storeDetectedImg(alertImage, alertId)
        return jsonify(
            {
                "message": "Data sent successfully",
                "result": 1,
            }
        )
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
        return jsonify({"message": e.msg, "result": -1})


def storeDetectedImg(imageString, alertID):
    # decode image
    image_64_decode = base64.b64decode(imageString)
    # store image with retuned AlertID
    filename = str(alertID) + ".jpg"
    imgFile = open(os.path.join(imageDirectory, filename), "wb")
    imgFile.write(image_64_decode)
    imgFile.close()


def insertNewAlertRecord():
    try:
        # create alert record with pending status
        query = "INSERT INTO alert (Status) VALUES ('Pending')"
        cursor = connection.cursor()
        cursor.execute(query)
        connection.commit()
        # retieve the last inserted record ID
        return cursor.lastrowid
    except mysql.connector.Error as e:
        print(e.msg)
        return -1
    finally:
        cursor.close()


def insertSendRecord(camID, alertID, timestamp):
    # create sendRecord inserting the retrieved alertID and Json Info
    try:
        insert_data = "INSERT INTO send VALUES (%s,%s,%s)"
        cursor = connection.cursor()
        cursor.execute(insert_data, (str(camID), str(alertID), timestamp))
        connection.commit()
    except mysql.connector.Error as e:
        print(e)
        return -1
    finally:
        cursor.close()


def getCameraInfo(cameraName):
    try:
        # retriveve camera floor and id using camera's name
        cameraInfoQuery = "SELECT floor, ID FROM CAMERA WHERE cameraName = %s"
        cameraInfoCursor = connection.cursor()
        cameraInfoCursor.execute(cameraInfoQuery, (cameraName,))
        cameraInfo = cameraInfoCursor.fetchall()
        for info in cameraInfo:
            floor = info[0]
            id = info[1]
        return {"floor": floor, "id": id}
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return -1
    finally:
        cameraInfoCursor.close()


def sendPushNotification(token, cam, floor):
    message = {
        "to": token,
        "sound": "default",
        "title": "Violenece Detected",
        "body": "cam: {} floor: {}".format(cam, floor),
        "_contentAvailable": True,
    }
    response = requests.post("https://exp.host/--/api/v2/push/send", json=message)
    return response.content


def getAlertImage(alertId):
    # find image file using alertID and File Path
    try:
        for root, dirs, files in os.walk(imageDirectory):
            for file in files:
                if int(file.replace(".jpg", "")) == alertId:
                    # File exist convert to string
                    with open(os.path.join(imageDirectory, file), "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode(
                            "utf-8"
                        )
                    return encoded_string
    except Exception as e:
        return e


# -----------------------------------


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json["id"]
    password = user_json["password"]
    token = user_json["token"]
    try:
        sqlQuery = (
            "SELECT ID, Password, UserType FROM user where  Password='"
            + password
            + "' and id = "
            + str(id)
        )

        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        userType = cursor.fetchone()
        if cursor.rowcount > 0:
            if userType[2] == "Admin":
                return jsonify({"result": "Admin"})
            else:
                user = {"id": id, "token": token}
                users.append(user)
            return jsonify({"result": "Security Guard"})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
    finally:
        cursor.close()


@app.route("/logout", methods=["POST"])
def logout():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json["id"]
    for user in users:
        if user.id == id:
            users.remove(user)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})


@app.route("/addCamera", methods=["POST"])
def addCamera():
    content = request.json
    cameraNum = content.get("cameraNum")
    camName = content.get("camName")
    cameraFloor = content.get("cameraFloor")
    adminId = content.get("adminId")
    try:
        sqlQuery = "INSERT INTO Camera (ID, FloorNum, AdminID, CameraName) VALUES (%s, %s, %s, %s)"
        cursor = connection.cursor()
        cursor.execute(
            sqlQuery, (int(cameraNum), str(cameraFloor), str(adminId), str(camName))
        )
        connection.commit()
        return jsonify({"result": 1})
    except mysql.connector.Error as e:
        print("Error inserting data into MySQL table", e)
        return jsonify({"result": -1})


@app.route("/getAlertRecord", methods=["GET"])
def getAlertRecord():
    try:
        sqlQuery = "SELECT CAST(timestamp AS DATE) AS alertDate, COUNT(timestamp) AS counter"
        "FROM send WHERE timestamp > (CURDATE() - INTERVAL 80 DAY) group by CAST(timestamp AS DATE)"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        alerts = cursor.fetchall()
        alertList = []

        sqlQueryResolved = "SELECT id, COUNT(*) FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.id = owlsys.alert.id WHERE Status = 'Resolved' AND DATE(timestamp) = curdate();"
        cursor.execute(sqlQueryResolved)
        resolved = cursor.fetchone()

        sqlQueryUnresolved = "SELECT id, COUNT(*) FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.id = owlsys.alert.id WHERE Status = 'Unresolved' AND DATE(timestamp) = curdate();"
        cursor.execute(sqlQueryUnresolved)
        unresolved = cursor.fetchone()

        if cursor.rowcount > 0:
            counter = {"resolved": resolved[1], "unresolved": unresolved[1]}

            for alert in alerts:
                date = alert[0].strftime("%Y-%m-%d")
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


@app.route("/deleteCamera", methods=["POST"])
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


@app.route("/getCamerasData", methods=["GET"])
def getData():
    try:
        sqlQuery = "SELECT id, floornum FROM CAMERA"
        sqlQuery = "SELECT id, floornum FROM CAMERA"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        camerasRecords = cursor.fetchall()
        cameraList = []
        if cursor.rowcount > 0:
            for record in camerasRecords:
                camera = {"id": record[0], "floor": record[1]}
                cameraList.append(camera)
            return jsonify({"cameraList": cameraList})
        else:
            return jsonify({"cameraList": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route("/getAlertLog", methods=["GET"])
def getAlertLogData():
    try:
        sqlQuery = "SELECT alert.ID, alert.Status, send.TimeStamp FROM alert, send WHERE alert.ID = send.AlertID"
        cursor = connection.cursor()
        cursor.execute(sqlQuery)
        AlertLogRecords = cursor.fetchall()
        AlertLog = []
        if cursor.rowcount > 0:
            for record in AlertLogRecords:
                date = record[2].strftime("%Y-%m-%d")
                time = record[2].strftime("%H:%M:%S")

                log = {"id": record[0], "status": record[1], "date": date, "time": time}
                AlertLog.append(log)
            return jsonify({"AlertLog": AlertLog})
        else:
            return jsonify({"AlertLog": 0})
    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


@app.route("/getLastCamera", methods=["GET"])
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


@app.route("/alertDetails", methods=["POST"])
def alertDetails():
    try:
        content = request.json
        alertId = content.get("alertId")

        alertDetailsQuery = """SELECT owlsys.alert.ID, Status, timestamp, owlsys.camera.Id, floornum FROM owlsys.alert INNER JOIN owlsys.send ON owlsys.send.alertID = owlsys.alert.ID INNER JOIN owlsys.camera ON owlsys.camera.Id = owlsys.send.camID WHERE alertID = %s ;"""
        detailsCursor = connection.cursor()
        detailsCursor.execute(alertDetailsQuery, (alertId,))
        details = detailsCursor.fetchone()

        respondentsDetailsQuery = """SELECT owlsys.user.ID, Fname, Lname FROM owlsys.receive INNER JOIN owlsys.user ON owlsys.receive.userID = owlsys.user.ID WHERE alertID = %s ;"""
        respondentsCursor = connection.cursor()
        respondentsCursor.execute(respondentsDetailsQuery, (alertId,))
        respondentRecord = respondentsCursor.fetchall()
        respondents = []

        try:
            with open(imageDirectory, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        except FileNotFoundError as e:
            print(e)

        if detailsCursor.rowcount > 0:
            date = details[2].strftime("%Y-%m-%d")
            time = details[2].strftime("%H:%M:%S")
            print(details[1])
            alertDetails = {
                "status": details[1],
                "date": date,
                "time": time,
                "camId": details[3],
                "floor": details[4],
                "image": encoded_string,
            }

            for record in respondentRecord:
                respondent = {"id": record[0], "fname": record[1], "lname": record[2]}
                respondents.append(respondent)

        return jsonify({"alertDetails": alertDetails}, {"respondents": respondents})

    except mysql.connector.Error as e:
        print("Error retrieving data into MySQL table", e)
        return jsonify({"result": -1})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
