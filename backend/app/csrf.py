from secrets import token_urlsafe

class CSRF:
    def __init__(self):
        self.token = token_urlsafe(32)

    def get_token(self) -> str:
        return self.token

    def validate(self, request_token) -> bool:
        return self.token == request_token
