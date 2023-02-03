import requests
from alert import Alert

alert = Alert(2, 3)

alertMessage = {
    "cam": alert.cam,
    "floor": alert.floor
}

requests.post('http://10.120.1.203:8000/alert', json=alertMessage)
