from django.urls import path
from .views import *

urlpatterns = [
    path('', mock_interview_entry, name='mock-interview-entry'),
    path('mock-interview/<str:job>/', mock_interview, name='mock-interview'),
    path('analysis', analysis, name='video-analysis')
]
