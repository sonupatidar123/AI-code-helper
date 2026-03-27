from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai import get_code_review
from rest_framework import status
@api_view(['POST'])
def review_code(request):
    code = request.data.get("code")

    if not code:
        return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

    result = get_code_review(code)

    return Response({
        "review": result
    },status=status.HTTP_200_OK)
