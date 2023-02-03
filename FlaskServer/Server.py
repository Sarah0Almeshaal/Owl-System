from flask import Flask, request, jsonify, json, session
from flask_socketio import SocketIO, emit
import mysql.connector
import requests
import time
import logging


app = Flask(__name__)
count = 0;

@app.route('/accept',methods=['POST'])
def handleAccept():
    try:
        content = request.json
        return jsonify({"result": 1,"alertid":content.get('alertId')})
    except Exception as e:
        return jsonify({'result':0,'messgae':e})


@app.route('/resolve',methods=['POST'])
def handleResolve(userId,alertId):
    print("resloved--> userId:{}  alertId:{}",userId,alertId)
    return jsonify({"result": 1})


# ------------------------------------
@app.route('/alert', methods=['POST'])
def getAlert():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    cam = user_json['cam']
    floor = user_json['floor']
    try:
        tokens = ["ExponentPushToken[mtkEeIDK9c65s7_VdO8W7C]","ExponentPushToken[Wja7nsAEjdSSoC_BzJtNct]"]
        sendAlert(tokens,cam,floor)
        return jsonify({"message": "Data received successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "----SERVER ERROR: JSON OR PUSH NOTIFICATION------"})

def sendAlert(token,cam,floor):
    global count
    count += 1
    to = []
    for t in token:
        to.append(t)
    message = {
        "to": to,
        "sound": 'default',
        "title": 'Violenece Detected',
        "body": "cam: {} floor: {}".format(cam,floor),
        "data":
        {
            "id":count,
            "cam": cam,
            "floor": floor,
            "pic": 1,
            "respondents": 2
        },
    }
    response = requests.post('https://exp.host/--/api/v2/push/send', json=message)
    return response.content

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id'] 
    password = user_json['password']
    token = user_json['token']
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='owlsys', user='owlsys', password='admin')
        sql_select_Query = "SELECT * FROM user where  Password='" + \
            password + "' and id = " + str(id)

        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        cursor.fetchall()
        if cursor.rowcount > 0:
            # user = User(id, password, token)
            # users.append(user)
            time.sleep(5)
            sendAlert(token)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)


if __name__ == '__main__':
   app.run(host='0.0.0.0',port=5000, debug=True)
