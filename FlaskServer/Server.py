from flask import Flask, request, jsonify, json, session
import mysql.connector

app = Flask(__name__)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_str = json.dumps(data)
    user_json = json.loads(user_str)
    id = user_json['id']
    password = user_json['password']
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='owlsys', user='owlsys', password='admin')
        sql_select_Query = "SELECT * FROM user where  Password='" + \
            password + "' and id = " + str(id)

        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        records = cursor.fetchall()
        if cursor.rowcount > 0:
            return jsonify({"result": 1})
        else:
            return jsonify({"result": -1})

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)