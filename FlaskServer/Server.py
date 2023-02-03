import base64
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

app.secret_key = b'47089c4644e037ffd565920f1821d1752bdcc3b246ab75e4789ba222ebb09706'
users = []
# hashmap 

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
            user = User(id, password, token)
            users.append(user)
            # time.sleep(5)
            # sendAlert(token)
            print(token)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)


# @app.route('/alert', methods=['POST'])
# def getAlert():
#     data = request.get_json()
#     user_str = json.dumps(data)
#     user_json = json.loads(user_str)
#     cam = user_json['cam']
#     floor = user_json['floor']
#     print(cam)
#     print(floor)


@app.route('/notification')
# def sendAlert(Alert):
def sendAlert():
    message = {
        "to": "ExponentPushToken[mOTogOEEc592a0MduplUIY]",
        "sound": 'default',
        "title": 'App name',
        "body": "Violenece Detected",
        # "data":
        # {
        #     "cam": 3,
        #     "floor": 1,
        #     "Respondents": 0
        # }
    }
    alert()
    response = requests.post(
        'https://exp.host/--/api/v2/push/send', json=message)
    return response.content


# def image(file):
@app.route("/alert")
def alert():
    with open("C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    alert = {
        "cam": 3,
        "floor": 1,
        "image": encoded_string,
        "Respondents": 0
    }
    return jsonify({"alert": alert})
    # return requests.post('http://10.120.1.203:8000/alert', json=alert)


@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    for user in users:
        if (user.id == id):
            users.remove(user)
            for token in tokens:
                if (user.token == token):
                    tokens.remove(token)
                    session.pop('token', None)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
