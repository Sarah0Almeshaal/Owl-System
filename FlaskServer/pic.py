import base64
import requests

with open("C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())
    encoded_b2 = "".join([format(n, '08b') for n in encoded_string])

    print(encoded_b2)



# with open("C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png", "rb") as image_file:
#     binaryString = bytearray(image_file.read())
#     print(binaryString)

# files = {'media': open('C:/Users/Sara_/Desktop/FCIT/LVL 10/CPIT - 499/The Owl System/Owl-System/Violence Detection Model/owlsys-logo.png', 'rb')}
# requests.post("http://10.120.1.203:8000/image", files=files)
