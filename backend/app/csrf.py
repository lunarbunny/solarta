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
        return self.token == request_token
