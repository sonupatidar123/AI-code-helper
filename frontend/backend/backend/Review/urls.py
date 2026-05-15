from .views import review_code, health_check
from django.urls import path

urlpatterns = [
    path('review/', review_code, name='review_code'),
]