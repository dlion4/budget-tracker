import os
import re
import requests


values = [
    "BEGIN:VCARD\n",
    "VERSION:3.0\n",
    "FN:C23-199\n",
    "TEL;TYPE=VOICE,CELL;VALUE=text:447438017446\n",
]
phone_numbers = []

# Define a regex pattern to match the phone number
pattern = r"(?<=TEL;TYPE=VOICE,CELL;VALUE=text:)\d+"


# Iterate through the list of values and extract phone numbers using regex
for value in values:
    match = re.search(pattern, value)
    if match:
        phone_numbers.append(match.group())


def clean_text(filename):
    with open(filename) as file:
        readline = file.readlines()
        # Iterate through the list of values and extract phone numbers using regex
        for value in readline:
            match = re.search(pattern, value)
            if match:
                phone_numbers.append(match.group())

    return phone_numbers


BASE_WHATSAPP_ENDPOINT = "https://gate.whapi.cloud/groups"


def create_whatsapp_group(name, membersList):

    payload = {"participants": membersList, "subject": name}

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer iiEINNrX8XmVxdxJb2s79y0v1RfQdYdm",
    }

    response = requests.post(BASE_WHATSAPP_ENDPOINT, json=payload, headers=headers)

    print(response.text)


if __name__ == "__main__":
    members = clean_text("./whapi/raw.txt")
    create_whatsapp_group("Tifra", members[:100])
