
import requests

def sendAlert():
    try:
        url = 'http://10.120.1.203:5000/alert'
        info = {'cam':2,'floor':1}
        response = requests.post(url,json = info,verify=False)
        parsed = response.json()
        print(parsed)
    except Exception as e:
        print(e)

sendAlert()

