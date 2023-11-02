import re

# Remove characters except alphanumberic, space, and common punctuations.
ptn_text = re.compile(r'[^0-9A-Za-z .,?!\'\"]+')
def clean_text(input: str):
    if input is None:
        return None
    return re.sub(ptn_text, '', input).strip()

# User display name
def validate_name(input: str):
    if input is None or input == '':
        return False, 'Name is required.'
    if len(input) > 64:
        return False, 'Name is too long, must be maximum of 64 characters.'
    if len(input) < 3:
        return False, 'Name is too short, must be at least 3 characters.'
    return True, None

# Emails can only contain alphanumeric, @/+/-, and dot.
email_format_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
email_illegal_regex = re.compile(r"[^a-zA-Z0-9_.+-@]")
def validate_email(email: str):
    if email is None or email == '':
        return False, 'Email is required.'
    if re.match(email_format_regex, email) is None:
        return False, 'Email is invalid.'
    if re.match(email_illegal_regex, email) is not None:
        return False, 'Email contains illegal characters. (Only alphanumeric, @/+/-, and dot)'
    return True, None

def validate_password(pwd: str, check_complexity: bool = True):
    if pwd is None or pwd == '':
        return False, 'Password is required.'
    if check_complexity and (len(pwd) < 12 or pwd.isspace()):
        return False, 'Password does not meet complexity requirements. (Minimum 12 characters)'
    return True, None

def validate_mfa(mfa: str):
    if mfa is None or mfa == '':
        return False, 'MFA is required.'
    if len(mfa) != 6 or not mfa.isdigit():
        return False, 'MFA is invalid.'
    return True, None

def validate_about(input: str):
    if input is None:
        return False, 'About is required.'
    if len(input) > 250:
        return False, 'About is too long, must be <= 250 characters.'
    return True, None
