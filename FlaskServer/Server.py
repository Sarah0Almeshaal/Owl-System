from flask import Flask, request, jsonify, json, session
import mysql.connector
from user import User
import requests
import time


app = Flask(__name__)

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
            time.sleep(5)
            sendAlert(token)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)


@app.route('/alert', methods=['POST'])
def getAlert():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    cam = user_json['cam']
    floor = user_json['floor']
    print(cam)
    print(floor)



# def sendAlert(Alert):
def sendAlert(token):
    message = {
        "to": token,
        "sound": 'default',
        "title": 'App name',
        "body": "Violenece Detected",
        "data":
        {
            "cam": 3,
            "floor": 1,
            "pic": 1,
            "respondents": 2
        }
    }
    response = requests.post('https://exp.host/--/api/v2/push/send', json=message)
    return response.content


@app.route('/logout', methods=['POST'])
def logout():
    # remove the username from the session if it's there
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    for user in users:
        if (user.id == id):
            users.remove(user)
            session.pop('token', None)
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
