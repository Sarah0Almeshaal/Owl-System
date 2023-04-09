# import cv2


# def getCameras():
#     index = 0
#     arr = []    
#     while True:
#         cap = cv2.VideoCapture(index)
#         if not cap.read()[0]:
#             break
#         else:
#             arr.append(index)
#         cap.release()
#         index += 1
#     return arr

# print(getCameras())

import cv2
  
  
# define a video capture object
vid = cv2.VideoCapture(0)
print(cv2.VideoCapture.getBackendName(vid))
  
while(True):
      
    # Capture the video frameض  
    # by frame
    ret, frame = vid.read()
  
    # Display the resulting frame
    cv2.imshow('frame', frame)
      
    # the 'q' button is set as the
    # quitting button you may use any
    # desired button of your choice
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
  
# After the loop release the cap object
vid.release()
# Destroy all the windows
cv2.destroyAllWindows()