import requests
import os
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

API_KEY = os.getenv("OPENROUTER_API_KEY")


@require_http_methods(["GET"])
def health_check(request):
    return JsonResponse({
        "status": "healthy"
    })


@csrf_exempt
@require_http_methods(["POST"])
def review_code(request):
    try:
        data = json.loads(request.body)
        code = data.get("code", "")

        if not code:
            return JsonResponse({"error": "Code is required"}, status=400)

        # If no API key → return mock response
        if not API_KEY:
            return JsonResponse({
                "review": "Mock: API key not set"
            })

        review = review_code_with_ai(code)

        return JsonResponse({
            "review": review
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)


def review_code_with_ai(code):
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
                    "content": f"Review this code:\n{code}"
                }
            ]
        }
    )

    result = response.json()
    return result["choices"][0]["message"]["content"]