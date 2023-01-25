
from datetime import datetime
from flask import Flask, jsonify, request, escape, json, session
import mysql.connector
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
import requests
from requests.exceptions import ConnectionError, HTTPError

app = Flask(__name__)
tokens = [] 

def send_push_message(token):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        title='Violence Detected!'
                        ))
        parsed = response.json()
        print(parsed)
    except Exception as e:
        print(e)
    
# Process Alerts from Violence Detection
@app.route("/alert", methods=['POST'])
def alert():
    # Extract the data
    cam = request.form['CamNo']
    floor = request.form['Floor']
    
    data = {'cam':cam,'floor':floor}
    print(cam,floor)
    #Save Data to DB (send Table, alert Table)
    #Send Alert to React Native
    try:
      send_push_message('ExponentPushToken[Wja7nsAEjdSSoC_BzJtNct]')
      return jsonify({"message": "Data received successfully"})
    except Exception as e:
        print(e)

@app.route("/getAlerts", methods=['GET'])
def getAlert():
    return "cry in spanish"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 80, debug=True)