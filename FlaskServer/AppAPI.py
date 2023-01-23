
from datetime import datetime
from flask import Flask, jsonify, request, escape

app = Flask(__name__)

def timeNow():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S').split(" ")[1]


#(@)what URL should trigger our function.
@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/time') # http://127.0.0.1/time
def serve():
    return jsonify({"time": timeNow()})

@app.route('/api/data', methods=['POST'])
def post_data(): 
    data = request.get_json() 
    return jsonify({"message": "Data received successfully"})

@app.route("/alert", methods=['POST'])
def alert():
    # Extract the data
    Alert = request.form['Alert']
    CamNo = request.form['CamNo']
    Floor = request.form['Floor']
    print(Alert,CamNo,Floor)
    #Save Data to DB (send Table, alert Table)
    #Send Alert to React Native
    return jsonify({"message": "Data received successfully"})


@app.route("/alertNative", methods=['GET'])
def alertNative():
    return jsonify({"message": "Data received successfully"})


# Create Routes for accesing Data from database for reactnative

@app.route("/UpdateAlertStatus", methods=['POST'])
def updateAlertStatus():
    # IF user response/Accept an Alert on ReactNative -> post to flask the AlertID and response type and UserID
    # The flask Function connect to database and update based on the Data
        return jsonify({"message": "Data received successfully"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 80, debug=True)