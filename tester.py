import cv2
import numpy as np
from datetime import datetime
from tensorflow import keras
import matplotlib.pyplot as plt
from keras.models import load_model
import mysql.connector
from collections import deque
import requests
import os
from requests.adapters import HTTPAdapter, Retry
import json

def getDateTime():
    localTime = datetime.now()
    Time = "Local Time:", localTime.strftime("%m/%d/%Y, %H:%M:%S")
    return Time

resp  = requests.post("http://127.0.0.1:5000/alert",
             data={'Time':getDateTime(), 'Alert':'Violence Detected!!'})
             
# resp  = requests.post("http://127.0.0.1:5000/alert")
print(resp.json())
