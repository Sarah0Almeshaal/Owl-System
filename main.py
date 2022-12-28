from keras.models import load_model
from collections import deque
import matplotlib.pyplot as plt
import numpy as np
import cv2
from keras.models import load_model
from collections import deque
import os
from datetime import datetime
import pytz
# import argparse
# import pickle
# import time 

def getTime():
  JDH = pytz.timezone('Asia/Riyadh')
  timeNow = datetime.now(JDH)
  return timeNow

def capture_violence():
        print("Loading model ...")
        model = load_model('Model/modelnew.h5')

        trueCount = 0
        imageSaved = 0
        filename = 'savedImage.jpg'
        # finalImage = 'finaImage.jpg'
        sendAlert = 0
        location = "CAMERA-NAME"

        writer = None
        Q = deque(maxlen=128)
        (W, H) = (None, None)
        cap = cv2.VideoCapture(0)
        count = 0     
        while cap.isOpened():
            # read the next frame from the file
            (grabbed, frame) = cap.read()

            # if the frame was not grabbed, then we have reached the end
            # of the stream
            if not grabbed:
                break
            
            # if the frame dimensions are empty, grab them
            if W is None or H is None:
                (H, W) = frame.shape[:2]

            # clone the output frame, then convert it from BGR to RGB
            # ordering, resize the frame to a fixed 128x128, and then
            # perform mean subtraction

            output = frame.copy()
           
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (128, 128)).astype("float32")
            frame = frame.reshape(128, 128, 3) / 255

            # make predictions on the frame and then update the predictions
            # queue
            preds = model.predict(np.expand_dims(frame, axis=0))[0]
#             print("preds",preds)
            Q.append(preds)

            # perform prediction averaging over the current history of
            # previous predictions
            results = np.array(Q).mean(axis=0)
            i = (preds > 0.50)[0]
            label = i

            text_color = (0, 255, 0) # default : green

            if label: # Violence prob
                text_color = (0, 0, 255) # red
                trueCount = trueCount + 1
            else:
                text_color = (0, 255, 0)

            text = "Violence: {}".format(label)
            FONT = cv2.FONT_HERSHEY_SIMPLEX 

            cv2.putText(output, text, (35, 50), FONT,1.25, text_color, 3) 

            # check if the video writer is None
            if writer is None:
                # initialize our video writer
                fourcc = cv2.VideoWriter_fourcc(*"MJPG")
                writer = cv2.VideoWriter("recordedVideo.avi", fourcc, 30,(W, H), True)

            # write the output frame to diskq
            writer.write(output)

            # show the output image
            cv2.imshow("CameraName",output)

            if(trueCount == 50):
              if(imageSaved == 0):
                if(label):
                  cv2.imwrite(filename, output) #cv2.imwrite(filename, image)
                  imageSaved = 1
            
              if(sendAlert == 0):
                timeMoment = getTime()
                # bot.sendPhoto(-1001522775837, photo=open(filename, 'rb')) 
                message =  f"VIOLENCE ALERT!! \nLOCATION: {location} \nTIME: {timeMoment}"
                print("\n\n\nTHIS IS THE MESSAGE!!!\n",message,"\n\n\n")
                # photoMessage = photo=open(filename, 'rb')
                sendAlert = 1

            key = cv2.waitKey(1) & 0xFF

            # if the `q` key was pressed, break from the loop
            if key == ord("q"):
                break
        # release the file pointersq
        print("[INFO] cleaning up...")
        writer.release()
        cap.release()


capture_violence()



# ________________________________________________________________________
# ________________________________________________________________________
# ________________________________________________________________________




def print_results(video, limit=None):
        print("Loading model ...")
        model = load_model('Model/modelnew.h5')
        Q = deque(maxlen=128)
        vs = cv2.VideoCapture(video)
        writer = None
        (W, H) = (None, None)
        count = 0     
        while True:
            # read the next frame from the file
            (grabbed, frame) = vs.read()

            # if the frame was not grabbed, then we have reached the end
            # of the stream
            if not grabbed:
                break
            
            # if the frame dimensions are empty, grab them
            if W is None or H is None:
                (H, W) = frame.shape[:2]

            # clone the output frame, then convert it from BGR to RGB
            # ordering, resize the frame to a fixed 128x128, and then
            # perform mean subtraction

            
            output = frame.copy()
           
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (128, 128)).astype("float32")
            frame = frame.reshape(128, 128, 3) / 255

            # make predictions on the frame and then update the predictions
            # queue
            preds = model.predict(np.expand_dims(frame, axis=0))[0]
#             print("preds",preds)
            Q.append(preds)

            # perform prediction averaging over the current history of
            # previous predictions
            results = np.array(Q).mean(axis=0)
            i = (preds > 0.50)[0]
            label = i

            text_color = (0, 255, 0) # default : green

            if label: # Violence prob
                text_color = (0, 0, 255) # red

            else:
                text_color = (0, 255, 0)

            text = "Violence: {}".format(label)
            FONT = cv2.FONT_HERSHEY_SIMPLEX 

            cv2.putText(output, text, (35, 50), FONT,1.25, text_color, 3) 

            # check if the video writer is None
            if writer is None:
                # initialize our video writer
                fourcc = cv2.VideoWriter_fourcc(*"MJPG")
                writer = cv2.VideoWriter("output/v_output.avi", fourcc, 30,(W, H), True)

            # write the output frame to disk
            writer.write(output)

            # show the output image
            cv2.imshow("preview",output)
            key = cv2.waitKey(1) & 0xFF

            # if the `q` key was pressed, break from the loop
            if key == ord("q"):
                break
        # release the file pointersq
        print("[INFO] cleaning up...")
        writer.release()
        vs.release()


# current_directory = os.getcwd()
# final_directory = os.path.join(current_directory, r'frames')
# os.mkdir(final_directory)

# V_path = "Dataset\Real Life Violence Dataset\Violence\V_19.mp4"  
# NV_path = "/nonv.mp4"
# print_results(V_path)
