
import requests
import os
import base64


imageDirectory = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/"

def sendAlert():
    try:
        url = 'http://192.168.10.119:5000/alert'
        info = {'cam':2,'floor':1}
        response = requests.post(url,json = info,verify=False)
        parsed = response.json()
        print(parsed)
    except Exception as e:
        print(e)

def requestImageTest():
    url = 'http://127.0.0.1:5000/alertImage'
    response = requests.post(url,json = {'alertId':33},verify=False)
    parsed = response.json()
    print(parsed)

requestImageTest()


