from flask import session

class User:
    def __init__(self, id, password, token):
     self.id = id
     self.password = password
     self.token = token



