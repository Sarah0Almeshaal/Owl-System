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


#################### < MySQL DB Connection > ######################
db = mysql.connector.connect(
    host="localhost",
    user="owlsys",
    password="admin",
    database="owlsys"
)

mycursor = db.cursor()
db.close()

##################### < Print Date and Time Method > ######################

def getDateTime():
    localTime = datetime.now()
    Time = "Local Time:", localTime.strftime("%m/%d/%Y, %H:%M:%S")
    # print(Time)
    return Time

##################### < Save Video of Violence Method > ######################


def SaveVideo(output_path, W, H):
    # initialize video writer
    fourcc = cv2.VideoWriter_fourcc(*"MJPG")
    writer = cv2.VideoWriter(output_path, fourcc, 30, (W, H), True)
    writer.release()


##################### < Load Model > ######################
print("Loading model ...")
model = keras.models.load_model('C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Model/modelnew.h5')
##################### < Violence Detect > ######################

# '0' = webcam , we can change it to MP4 link for testing
input_path = "C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Videos/V_15.mp4"

# Save output video file in output_path
output_path ="C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames/output.avi"

# save frame in this path
output_path_frames ="C:/Users/jeela/Desktop/VScode workplace/OwlSystem/Violence Detection Model/Saved Frames"

trueCount = 0  # > Violence frames count
sendAlert = 0
count = 0

(W, H) = (None, None)
Q = deque(maxlen=128)

# Capture video object
cam = cv2.VideoCapture(input_path)

while cam.isOpened():
    grabbed, frame = cam.read()

    if not grabbed:
        print('There is no frame. Streaming ends.')
        break

    if W is None or H is None:
        # W: width, H: height of frame img
        (H, W) = frame.shape[:2]

    # capture frame for edit
    output = frame.copy()
    clean_frame = frame.copy()

    # convert frame from BGR to RGB
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # resize the frame to a fixed 128x128
    frame = cv2.resize(frame, (128, 128)).astype("float32")
    # perform mean subtraction
    frame = frame.reshape(128, 128, 3) / 255

    # make predictions on the frame and then update the predictions queue
    preds = model.predict(np.expand_dims(frame, axis=0))[0]
    Q.append(preds)

    # perform prediction averaging over the
    # current history of previous predictions
    results = np.array(Q).mean(axis=0)
    i = (preds > 0.50)[0]
    label = i

    # default : green
    text_color = (0, 255, 0)

    # If "violence = true", change text color to red
    if label:
        text_color = (0, 0, 255)
        trueCount += 1
    else:
        text_color = (0, 255, 0)

    text = "Violence: {}".format(label)
    FONT = cv2.FONT_HERSHEY_SIMPLEX

    cv2.putText(output, text, (35, 50), FONT, 1.25, text_color, 3)

    # show the output frame
    # cv2.imshow("CAM", output)

    if (trueCount == 40):
        if (sendAlert == 0):
            print("Violence Detected!!")
            # SaveVideo(output_path, W, H)
            try:
                # Get current date of detection
                now = datetime.now()
                timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
                # Handle detection's information by calling an API 
                url = 'http://127.0.0.1:5000/alert'
                # information about camera and its floor number and detection timestamp
                info = {'cam':"1.1.1.1",'floor':1,'timestamp':timestamp}
                response = requests.post(url,json = info,verify=False)
                parsed = response.json()
                print(parsed)
                # store frame with alert as file name
                if(parsed['result']==1):
                    cv2.imwrite(os.path.join(output_path_frames,str(parsed["alertId"])+'.jpg'),clean_frame)
            except Exception as e:
                print(e)
            sendAlert = 1


    # if the `q` key was pressed, break from the loop
    if (cv2.waitKey(1) & 0xFF == ord("q")):
        break


print('Video recording ends. Release Memory.')
cam.release()
cv2.destroyAllWindows()
