import re

# Alphanumberic, space, and common punctuations.
ptn_text = re.compile(r'[^0-9A-Za-z .,?!\'\"]+')
def clean_text(input):
    if input is None:
        return None
    return re.sub(ptn_text, '', input).strip()

# Emails: Alphanumberic, @, and dot.
ptn_email = re.compile(r'[^0-9A-Za-z.@]+')
def clean_email(input):
    if input is None:
        return None
    return re.sub(ptn_email, '', input).strip()

def validate_name(input):
    if input is None:
        return False, 'Name is required.'
    if len(input) > 64:
        return False, 'Name is too long, must be maximum of 64 characters.'
    if len(input) < 3:
        return False, 'Name is too short, must be at least 3 characters.'
    return True, None

email_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
def validate_email(email):
    if email is None:
        return False, 'Email is required.'
    if re.match(email_regex, email) is None:
        return False, 'Email is invalid.'
    return True, None

def validate_password(pwd):
    if pwd is None:
        return False, 'Password is required.'
    if len(pwd) < 8:
        return False, 'Password is too short, must be at least 8 characters.'
    return True, None

def validate_mfa(mfa: str):
    if mfa is None:
        return False, 'MFA is required.'
    if len(mfa) != 6 or not mfa.isdigit():
        return False, 'MFA is invalid.'
    return True, None

def validate_about(input):
    if input is None:
        return False, 'About is required.'
    if len(input) > 1024:
        return False, 'About is too long, must be <= 250 characters.'
    return True, None
