from secrets import token_urlsafe

class CSRF:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CSRF, cls).__new__(cls)
            cls._instance.token = token_urlsafe(32)
        return cls._instance

    def get_token(self) -> str:
        return self.token

    def validate(self, request_token) -> bool:
        print("SELF TOKEN IS " + self.token)
        print("REQUEST TOKEN IS " + request_token)
        print(self.token == request_token)
        if request_token is None:
            return False
        return self.token == request_token
