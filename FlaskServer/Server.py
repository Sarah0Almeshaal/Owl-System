import base64
from flask import Flask, request, jsonify, json, session
import mysql.connector
import requests
import time
import os


app = Flask(__name__)
# Detetction creates the id and saves itto database, then we use it for all requests
imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/"
users = [{"id": 1015},{"id": 1185}]

try:
     connection = mysql.connector.connect(host='localhost',
     database='owlsys', user='owlsys', password='admin')
except Exception as e:
    print(e)



@app.route('/accept',methods=['POST'])
def handleAccept():
    try:
        content = request.json
        # add the content to database
        return jsonify({"result": 1,"alertid":content.get('alertId')})
    except Exception as e:
        return jsonify({'result':-1,'messgae':e})


@app.route('/resolve',methods=['POST'])
def handleResolve(userId,alertId):
    print("resloved--> userId:{}  alertId:{}",userId,alertId)
    return jsonify({"result": 1})

# push notification
def sendAlert(token,cam,floor,alertId):
    message = {
        "to": token,
        "sound": 'default',
        "title": 'Violenece Detected',
        "body": "cam: {} floor: {}".format(cam,floor),
        "data":
        {
            "id":alertId,
            "cam": cam,
            "floor": floor,
            "pic": 1,
            "respondents": 2,
        },
        "_contentAvailable": True,
    }
    response = requests.post('https://exp.host/--/api/v2/push/send', json=message)
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
            #3/create sendRecord inserting the retrieved alertID and Json Info 
            try:
                insert_data = "INSERT INTO send VALUES (%s,%s,%s)"
                cursor.execute(insert_data,(str(cam),str(alertId),timestamp))
            except mysql.connector.Error as e:
                return jsonify({"message":e.msg,"result":-1})
            for user in users:
                # 4/ create recieveRecord inserting userID and AlertID
                try:
                    insert_data = "INSERT INTO receive (userID,alertID) VALUES (%s,%s)"
                    cursor.execute(insert_data,(str(user["id"]),str(alertId)))
                    connection.commit()
                except mysql.connector.Error as e:
                    return jsonify({"message":e.msg,"result":-1})
                # 5/ push notification
                # sendAlert(user["token"],cam,floor,alertId)
            return jsonify({"message": "Data inserted successfully","alertId":alertId,"result": 1})
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
        return jsonify({"message":e.msg,"result":-1})
    finally:
        cursor.close()
    

# -----------------------------------


@app.route("/alertImage",methods=['POST'])
def sendAlertImage():
    data = request.get_json()
    data_str = json.dumps(data)
    data_json = json.loads(data_str)
    # alert Id in integer; used for finding the image file name 
    alertId = data_json['alertId']
    try:
        for root, dirs, files in os.walk(imageDirectory):
            for file in files:
                if(int(file.replace(".jpg",""))==alertId):
                    # already found the file name === the alert ID
                    with open(os.path.join(imageDirectory,file), "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    alertImage = {"image": encoded_string,}
                    return jsonify(alertImage)
    except Exception as e:
        return jsonify({"msg": 'eror'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    password = user_json['password']
    token = user_json['token']
    try:
        sql_select_Query = "SELECT * FROM user where  Password='" + \
            password + "' and id = " + str(id)

        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        cursor.fetchall()
        if cursor.rowcount > 0:
            user = {
                "id": id,
                "token": token
            }
            users.append(user)
            return jsonify({"result": 1})
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
