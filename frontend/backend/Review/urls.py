from .views import review_code, health_check
from django.urls import path

urlpatterns = [
    path('', health_check, name='health_check'),
    path('health/', health_check, name='health_check'),
    path('review/', review_code, name='review_code'),
]