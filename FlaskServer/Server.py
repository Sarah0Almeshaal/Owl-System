import base64
from flask import Flask, request, jsonify, json, session
import mysql.connector
import requests
import time


app = Flask(__name__)
# Detetction creates the id and saves itto database, then we use it for all requests
count = 0;
users = []

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


# @app.route('/alert', methods=['POST'])
# def getAlert():
#     data = request.get_json()
#     user_str = json.dumps(data)
#     user_json = json.loads(user_str)
#     cam = user_json['cam']
#     floor = user_json['floor']
#     try:
#         # process alert request (token and alert data)
#         tokens = ["ExponentPushToken[mtkEeIDK9c65s7_VdO8W7C]","ExponentPushToken[Wja7nsAEjdSSoC_BzJtNct]"]
#         # sendAlert(tokens,cam,floor)
#         return jsonify({"message": "Data received successfully"})
#     except Exception as e:
#         print(e)
#         return jsonify({"message": "----SERVER ERROR: JSON OR PUSH NOTIFICATION------"})

# def sendAlert(token,cam,floor):
#     global count
#     count += 1
#     to = []
#     for t in token:
#         to.append(t)
#     message = {
#         "to": to,
#         "sound": 'default',
#         "title": 'Violenece Detected',
#         "body": "cam: {} floor: {}".format(cam,floor),
#         "data":
#         {
#             "id":count,
#             "cam": cam,
#             "floor": floor,
#             "pic": 1,
#             "respondents": 2
#         },
#     }
#     response = requests.post('https://exp.host/--/api/v2/push/send', json=message)
#     return response.content

def sendAlert(token,cam,floor):
    global count
    count += 1
    message = {
        "to": token,
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

@app.route('/alert', methods=['POST'])
def getAlert():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    cam = user_json['cam']
    floor = user_json['floor']
    try:
        for user in users:
            sendAlert(user["token"],cam,floor)
        return jsonify({"message": "Data received successfully"})
    except Exception as e:
        print(e)
        return jsonify({"message": "----SERVER ERROR: JSON OR PUSH NOTIFICATION------"})


# -----------------------------------


@app.route("/alertImage")
def sendAlertImage():
    with open("C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
   
    alertImage = {
        "image": encoded_string,
    }
    return jsonify({"alert": alertImage})


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
