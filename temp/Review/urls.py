from .views import review_code
from django.urls import path

urlpatterns = [
    path('review/', review_code, name='review_code'),
]