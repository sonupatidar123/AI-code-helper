import google.generativeai as genai
import os
import time
from dotenv import load_dotenv
from google.api_core import exceptions

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")
genai.configure(api_key=api_key)

# Rate limiting protection
last_request_time = 0
MIN_REQUEST_INTERVAL = 5  # 5 seconds between requests (increased from 2 to avoid rate limits)

# DSA Mentor System Instruction
SYSTEM_INSTRUCTION = """
You are a strict DSA mentor.

Your job is to HELP the user THINK, not to give solutions.

---

🔥 VERY STRICT RULES (MUST FOLLOW):

1. NEVER provide full code
2. NEVER provide complete solution
3. EVEN IF user asks "give code" → REFUSE politely
4. ONLY provide hints, steps, and direction

---

Response Structure (ALWAYS FOLLOW):

1. 🧠 Pattern Identification
- Identify the pattern (Sliding Window, DP, etc.)
- Explain WHY this pattern fits

2. 🔍 Key Observation
- What is the core idea to notice?

3. 🪜 Step-by-Step Hint
- Break solution into small thinking steps
- Do NOT complete the logic fully

4. ⚠️ Traps / Mistakes
- Common mistakes to avoid

5. 👉 Next Step for User
- Tell user what to try next

---

If user asks for code:
👉 Respond:
"I won't provide the full code. Try implementing using the hints. If stuck, ask for the next hint."

---

Style:
- Teach like a mentor (like DSA sheet / playlist style)
- Keep it simple and logical
- Push user to think

---

Goal:
Make the user solve the problem on their own.
"""

def get_code_review(code):
    """
    Generate code review with rate limiting and retry logic.
    Follows the pattern from Node.js ai.service.js
    """
    global last_request_time
    
    # Rate limiting: wait if necessary
    time_since_last_request = time.time() - last_request_time
    if time_since_last_request < MIN_REQUEST_INTERVAL:
        wait_time = MIN_REQUEST_INTERVAL - time_since_last_request
        print(f"Rate limiting: waiting {wait_time:.2f}s before next request")
        time.sleep(wait_time)
    
    last_request_time = time.time()
    
    # Initialize model with fallback logic (using same model as Node.js version)
    model_name = "gemini-flash-latest"  # Same as Node.js ai.service.js
    try:
        model = genai.GenerativeModel(model_name)
    except Exception:
        # If preferred model fails, try alternative
        print(f"Model {model_name} not available, trying gemini-1.5-flash...")
        model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Combine system instruction with the prompt for better compatibility
    prompt = f"""{SYSTEM_INSTRUCTION}

---

User Code to Review:
```
{code}
```

Provide your mentorship review following the structure above."""
    
    try:
        response = model.generate_content(prompt)
        print("Code review generated successfully")
        return response.text
    
    except exceptions.ResourceExhausted as e:
        print("Rate limit hit, retrying after 30 seconds...")
        time.sleep(30)  # Wait 30 seconds before retry
        
        try:
            # Retry once
            response = model.generate_content(prompt)
            print("Retry successful")
            return response.text
        except Exception as retry_error:
            print(f"Retry also failed: {str(retry_error)}")
            return "⚠️ API rate limit exceeded. The free tier has limited requests per minute. Please wait 1-2 minutes and try again, or consider upgrading to a paid plan at https://ai.google.dev/pricing"
    
    except Exception as e:
        error_message = str(e)
        print(f"Error in code review: {error_message}")
        print(f"Error type: {type(e).__name__}")
        
        # More detailed error logging
        if hasattr(e, 'status_code'):
            print(f"Status code: {e.status_code}")
        if hasattr(e, 'details'):
            print(f"Details: {e.details}")
        
        # Handle specific errors
        if "API" in error_message or "400" in error_message or "403" in error_message:
            return f"❌ API configuration error: {error_message}. Please verify your API key is valid and has Generative AI API enabled at https://console.cloud.google.com/"
        
        if "invalid" in error_message.lower():
            return "❌ Invalid request to API. Check your API key and ensure it's from https://aistudio.google.com/app/apikey"
        
        # Generic error message
        return f"⚠️ Error generating review: {error_message[:100]}"


def list_available_models():
    """
    Debug utility: List all available models that support generateContent
    """
    try:
        print("\n=== Available Models ===")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"✓ {model.name}")
        print("========================\n")
    except Exception as e:
        print(f"Error listing models: {str(e)}")