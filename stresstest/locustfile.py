from locust import HttpUser, TaskSet, task, between, events, clients
import json

class UserBehavior(TaskSet):

    def __init__(self, parent):
        super().__init__(parent)
        self.token = None

    def on_start(self):
        self.token = self.get_token()

    def get_token(self):
        if self.token:
            return self.token
        try:
            with open("token.txt", "r") as f:
                token = f.read()
                if len(token) > 5:
                    return token
        except FileNotFoundError:
            pass
        headers = {'content-type': 'application/json'}
        body = json.dumps({
            "user": {
                "user_id": "583c3ac3f38e84297c002546",
                "email": "test@test.com",
                "name": "test@test.com",
                "given_name": "Hello",
                "family_name": "Test",
                "nickname": "test",
                "last_ip": "94.121.163.63",
                "logins_count": 15,
                "email_verified": True
            },
            "access_token": {
                "scope": ["openid", "profile"],
                "authorization_details": [],
                "client_id": "my",
                "iss": "test.iss.test",
                "jti": "jit",
                "sub": "asdasd",
                "uid": "asdasd",
                "origin": "asdasd",
                "iat": 1717063455,
                "uuid": "asdasdasd",
                "exp": 1717070655
            },
            "id_token": {
                "user_id": "583c3ac3f38e84297c002546",
                "email": "test@test.com",
                "name": "test@test.com",
                "given_name": "Hello",
                "family_name": "Test",
                "nickname": "test",
                "last_ip": "94.121.163.63",
                "logins_count": 15,
                "email_verified": True,
                "scope": ["openid", "profile"],
                "authorization_details": [],
                "client_id": "my",
                "iss": "test.iss.test",
                "jti": "jit",
                "sub": "asdasd",
                "uid": "asdasd",
                "origin": "asdasd",
                "iat": 1717063455,
                "uuid": "asdasdasd",
                "exp": 1717070655
            }
        })
        response = self.client.post('http://localhost:8080/configurations', headers=headers, data=body)
        response.raise_for_status()
        response = self.client.post("http://localhost:8080/as/token.oauth2", headers={"content-type": "application/json"})
        response.raise_for_status()
        token = response.json()["access_token"]

        with open("token.txt", "w") as f:
            f.write(token)
        return token

    @task(1)
    def hello(self):
        self.client.get("/hello")

    @task(2)
    def secret(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        self.client.get("/secret", headers=headers)

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(0, 1)