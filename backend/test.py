import requests
import json

# Your Django API URL
URL = "http://127.0.0.1:8000/api/review/"

# Test code input
data = {
    "code": "print('Hello World')"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(URL, headers=headers, data=json.dumps(data))

    print("Status Code:", response.status_code)
    print("Response:")

    try:
        print(response.json())
    except:
        print(response.text)

except Exception as e:
    print("Error:", e)