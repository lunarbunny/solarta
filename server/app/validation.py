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