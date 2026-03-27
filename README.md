# AI Code Helper - Setup Guide

A full-stack application that provides AI-powered code reviews using Google Gemini API. The backend is built with Django REST Framework, and the frontend is built with React.

## 🎯 Features

- ✅ AI-powered code review using Google Gemini API
- ✅ DSA mentor system for educational code reviews
- ✅ Rate limiting and retry logic for API stability
- ✅ REST API endpoints with Django
- ✅ React frontend with modern UI
- ✅ Environment variable security (no hardcoded keys)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Google Gemini API Key** ([Get Key](https://aistudio.google.com/app/apikey))

---

## 🚀 Project Structure

```
AI-code-helper/
├── Backend/                    # Django Backend
│   ├── config/                # Django settings
│   ├── Review/               # Code review app
│   │   ├── views.py         # API endpoints
│   │   ├── ai.py            # Gemini API integration
│   │   └── urls.py          # URL routing
│   ├── .env                 # Environment variables (DO NOT COMMIT)
│   ├── manage.py            # Django CLI
│   └── db.sqlite3           # Database
│
├── frontend/                 # React Frontend
│   ├── src/
│   ├── package.json
│   └── public/
│
├── README_SETUP.md          # This file
└── .gitignore
```

---

## 🔧 Backend Setup (Django)

### Step 1: Create Virtual Environment

```bash
# Navigate to project root
cd c:\Users\sonup\AI-code-helper

# Create virtual environment
python -m venv ACHenv

# Activate virtual environment
# On Windows:
ACHenv\Scripts\activate

# On macOS/Linux:
source ACHenv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Install required Python packages
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install django djangorestframework django-cors-headers python-dotenv google-generativeai
```

### Step 3: Setup Environment Variables

Create a `.env` file in the `Backend/` directory:

```bash
cd Backend
```

**Backend/.env:**
```
# Google Gemini API
GOOGLE_API_KEY=your_actual_api_key_here

# Django Settings
SECRET_KEY=django-insecure-1$ys81i6t02q*#=*h+6%8fwtqem9kjz$-l68&oqcvw=qv!3krb
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**⚠️ Important:** Replace `your_actual_api_key_here` with your Google Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)

### Step 4: Run Migrations

```bash
python manage.py migrate
```

### Step 5: Start Django Server

```bash
python manage.py runserver
```

✅ Backend running at: `http://127.0.0.1:8000`

---

## 🎨 Frontend Setup (React)

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure API Endpoint

Update `frontend/src/api.js` or relevant service file:

```javascript
const API_URL = 'http://127.0.0.1:8000/api';
```

### Step 4: Start React Server

```bash
npm start
```

✅ Frontend running at: `http://localhost:3000`

---

## 📡 API Endpoints

### Code Review Endpoint

**POST** `/api/review/`

**Request:**
```json
{
  "code": "def hello():\n    print('Hello, World!')"
}
```

**Response (Success):**
```json
{
  "review": "🧠 Pattern Identification...\n\n🔍 Key Observation...\n\n..."
}
```

**Response (Error - Rate Limited):**
```json
{
  "review": "⚠️ API rate limit exceeded. Please wait 1-2 minutes and try again..."
}
```

---

## 🧪 Testing the Endpoints

### Using Postman

1. Import this request:
   - **Method:** POST
   - **URL:** `http://127.0.0.1:8000/api/review/`
   - **Headers:** `Content-Type: application/json`
   - **Body:**
   ```json
   {
     "code": "def add(a, b):\n    return a + b"
   }
   ```

2. Send the request and check the response

### Using cURL

```bash
curl -X POST http://127.0.0.1:8000/api/review/ \
  -H "Content-Type: application/json" \
  -d '{"code": "def hello():\n    print(\"hi\")"}'
```

---

## 🔑 Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Gemini API key from aistudio.google.com |
| `SECRET_KEY` | Yes | Django secret key (for production, use strong key) |
| `DEBUG` | No | Set to `False` in production |
| `ALLOWED_HOSTS` | No | Comma-separated list of allowed hosts |

---

## ⚡ How It Works

1. **Frontend** sends code to backend via POST request
2. **Django views.py** receives the request
3. **ai.py** loads API key from `.env` and uses Gemini API
4. **Rate limiting** (5 seconds between requests) prevents quota exhaustion
5. **Retry logic** (30 seconds wait) handles rate limit errors gracefully
6. **Response** is returned to frontend

---

## 🐛 Troubleshooting

### Issue: `GOOGLE_API_KEY not found`

**Solution:**
- ✅ Check `.env` file exists in `Backend/` folder
- ✅ Verify API key is correct
- ✅ Reload server after creating `.env`

```bash
# Test if .env is loaded:
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GOOGLE_API_KEY')[:20])"
```

### Issue: `404 Model not found`

**Solution:**
The model name might not be available. Check available models:

```python
from Review.ai import list_available_models
list_available_models()
```

### Issue: `429 TooManyRequests`

**Solution:**
- ✅ You've exceeded free tier quota
- ✅ Wait 1-2 minutes before retrying
- ✅ Upgrade to paid plan: [ai.google.dev/pricing](https://ai.google.dev/pricing)

### Issue: CORS errors from frontend

**Solution:**
Ensure `cors_headers` is in `INSTALLED_APPS`:

```python
# Backend/config/settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## 📚 Model Information

- **Model:** `gemini-flash-latest`
- **API Version:** v1beta
- **Free Tier Limits:**
  - Requests per minute: Limited
  - Daily requests: Limited
  - Input tokens: Limited

**Recommendation:** Upgrade to paid plan for production use

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env`** - It's in `.gitignore`
2. ✅ **Use environment variables** - Don't hardcode API keys
3. ✅ **Rate limiting enabled** - Prevents quota exhaustion
4. ✅ **Input validation** - Always validate user input
5. ✅ **Error handling** - Graceful error messages

---

## 📦 Production Deployment

### Before Deploying:

1. **Change DEBUG to False**
   ```
   DEBUG=False
   ```

2. **Use strong SECRET_KEY**
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

3. **Update ALLOWED_HOSTS**
   ```
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   ```

4. **Use production database** (PostgreSQL recommended)

5. **Increase rate limit interval** to 10+ seconds

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Django logs: `Backend/logs/`
3. Check Google Gemini API status: [status.cloud.google.com](https://status.cloud.google.com)

---

## 📄 License

This project is open source. Modify and use as needed.

---

## ✨ Next Steps

- [ ] Get Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
- [ ] Create `.env` file with API key
- [ ] Run `python manage.py runserver`
- [ ] Run `npm start` in frontend
- [ ] Test with sample code
- [ ] Deploy to production

---

**Happy coding! 🚀**


## Features
- Code error detection
- AI explanation
- Code suggestions

## Tech Stack
- Django (Backend)
- React (Frontend)
- PostgreSQL (Database)

## Setup Instructions
Coming soon...