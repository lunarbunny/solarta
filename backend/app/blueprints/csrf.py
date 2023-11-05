from secrets import token_urlsafe

class CSRF:
    _instance = None
    def __new__(self):
        if self._instance is None:
            self._instance = super(CSRF, self).__new__(self)
            self._instance.token = token_urlsafe(32)
        return self._instance

    def get_token(self) -> str:
        return self.token

    def validate(self, request_token) -> bool:
        if request_token is None:
            return False
        return self.token == request_token
    
    def regenerate_token(self):
        if self._instance is not None:
            self._instance.token = token_urlsafe(32)
        return self._instance
