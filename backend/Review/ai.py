import requests
import os

API_KEY = os.getenv("OPENROUTER_API_KEY")

def review_code_with_ai(code):
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta-llama/llama-3-8b-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": f"""
You are a senior software engineer.

Review this code:
{code}

Rules:
- Do NOT overcomplicate simple code
- Give practical improvements only
- Avoid unnecessary logging or try-except for basic code
- Keep optimized code clean and minimal

Output format:
1. Issues
2. Improvements
3. Optimized Code
"""
                    }
                ]
            }
        )

        result = response.json()

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        print("AI Error:", e)
        return "Error reviewing code"