import requests

# Test the API endpoint
url = "http://127.0.0.1:8000/api/review/"
data = {"code": "def hello():\n    print('Hello World')"}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")