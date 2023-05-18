import cv2

camIP3 = "rtsp://Sara1234:Sara1234@10.10.1.26/live0"

cap = cv2.VideoCapture(camIP3)

while cap.isOpened():
    ret, frame = cap.read()
    cv2.imshow("frame", frame)

    if (cv2.waitKey(1) & 0xFF == ord('q')):
        break

# print(cv2.getBuildInformation())
cap.release()
cv2.destroyAllWindows()

