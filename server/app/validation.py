import re

# Alphanumberic, space, and common punctuations.
ptn_text = re.compile(r'[^0-9A-Za-z .,?!\'\"]+')
def clean_text(input):
    return re.sub(ptn_text, '', input)

# Alphanumberic only.
ptn_alphanum = re.compile(r'[^0-9A-Za-z]+')
def clean_alphanum(input):
    return re.sub(ptn_alphanum, '', input)

# Emails: Alphanumberic, @, and dot.
ptn_email = re.compile(r'[^0-9A-Za-z.@]+')
def clean_email(input):
    return re.sub(ptn_email, '', input)

# Numbers only.
ptn_numbers = re.compile(r'[^0-9]+')
def clean_num_only(input):
    return re.sub(ptn_numbers, '', input)

def validate_name(input):
    if input is None:
        return False, 'Name is required.'
    if len(input) > 64:
        return False, 'Name is too long, must be <= 64 characters.'
    return True, None

email_regex = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")
def validate_email(email):
    if email is None:
        return False, 'Email is required.'
    if re.match(email_regex, email) is None:
        return False, 'Email is invalid.'
    return True, None

def validate_about(input):
    if input is None:
        return False, 'About is required.'
    if len(input) > 1024:
        return False, 'About is too long, must be <= 250 characters.'
    return True, None
