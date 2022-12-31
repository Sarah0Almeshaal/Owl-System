from keras.models import load_model
from collections import deque
import matplotlib.pyplot as plt
import numpy as np
import cv2
from keras.models import load_model
from collections import deque
import os
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="owlsys",
    password="admin",
    database="owlsys"
)

mycursor = db.cursor()
db.close()

def capture_violence():
        print("Loading model ...")
        model = load_model('Model/modelnew.h5')

        writer = None
        Q = deque(maxlen=128)
        (W, H) = (None, None)
        cap = cv2.VideoCapture('Videos/NV_8.mp4')
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

            else:
                text_color = (0, 255, 0)

            text = "Violence: {}".format(label)
            FONT = cv2.FONT_HERSHEY_SIMPLEX 

            cv2.putText(output, text, (35, 50), FONT,1.25, text_color, 3) 

            # check if the video writer is None
            if writer is None:
                # initialize our video writer
                fourcc = cv2.VideoWriter_fourcc(*"MJPG")
                writer = cv2.VideoWriter("Saved Frames/v_output.avi", fourcc, 30,(W, H), True)

            # write the output frame to diskq
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
        cap.release()

capture_violence()


