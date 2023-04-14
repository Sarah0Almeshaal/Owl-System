
import requests
import os
import base64
import mysql.connector
from flask import Flask, request, jsonify, json, session
import datetime
from datetime import datetime, timedelta
import time


# imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/"


# def sendAlert():
#     try:
#         now = datetime.now()
#         timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
#         url = 'http://127.0.0.1:5000/alert'
#         info = {'cam': "1.1.1.1", 'floor': 1, 'timestamp': timestamp}
#         response = requests.post(url, json=info, verify=False)
#         parsed = response.json()
#         print(parsed)
#     except Exception as e:
#         print(e)


# def requestImageTest():
#     url = 'http://127.0.0.1:5000/alertImage'
#     response = requests.post(url, json={'alertId': 33}, verify=False)
#     parsed = response.json()
#     print(parsed)


# def testAlertList():
#     url = 'http://127.0.0.1:5000/getAlerts'
#     response = requests.post(url, verify=False)
#     parsed = response.json()
#     print(parsed)


# def testDbFetch():
#     try:
#         connection = mysql.connector.connect(host='localhost',
#                                              database='owlsys', user='owlsys', password='admin')
#     except Exception as e:
#         print(e)

#     select_data = ("SELECT alert.ID as alertId, camera.Id as camId, camera.floor "
#                    "FROM alert "
#                    "INNER JOIN send ON alert.ID=send.alertID "
#                    "INNER JOIN camera ON send.camIP=camera.camIP "
#                    "WHERE alert.Status = 'pending';")
#     cursor = connection.cursor()
#     cursor.execute(select_data)
#     records = cursor.fetchall()
#     alertList = []
#     for row in records:
#         thisdict = {}
#         thisdict["alertId"] = row[0]
#         thisdict["camId"] = row[1]
#         thisdict["floor"] = row[2]
#         select_data = ("SELECT count(*) "
#                        "FROM receive "
#                        "INNER JOIN alert ON receive.alertID = alert.ID;")
#         cursor.execute(select_data)
#         records = cursor.fetchall()
#         responsCount = records[0][0]
#         thisdict["respondents"] = responsCount
#         # get image as string
#         for root, dirs, files in os.walk(imageDirectory):
#             for file in files:
#                 if (int(file.replace(".jpg", "")) == thisdict["alertId"]):
#                     # already found the file name === the alert ID
#                     with open(os.path.join(imageDirectory, file), "rb") as image_file:
#                         encoded_string = base64.b64encode(
#                             image_file.read()).decode('utf-8')
#         # store encoded image
#         thisdict["alertImage"] = encoded_string
#         # append dictionary to the list
#         alertList.append(thisdict)
#     cursor.close()
#     connection.close()
#     jsonString = json.dumps(alertList, indent=4)
#     print(jsonString)

# # sendAlert()
# # testAlertList()


# # f = '%Y-%m-%d %H:%M:%S'
# # t = datetime.strptime('2023-03-15 01:02:03', f) + timedelta(minutes=5)
# # n = datetime.now()
# users = [{"a": 1}, {"a": 5}, {"a": 1}, {"a": 5}]
# # print(int(len(users)/2))
# for u in users:
#     if u["a"] == 5:
#         users.remove(u)
# print(users)


def getCameraInfo():
    url = 'http://127.0.0.1:5000/getCameraInfo'
    camName = {'camName': "cam 2"}
    cameraInfo = requests.post(url, json=camName, verify=False)
    response = cameraInfo.json()
    # response[0]
    print(response)
    # print(response["id"])


getCameraInfo()