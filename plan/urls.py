from django.urls import path
from .views import *

urlpatterns = [
    path('',plans ,name='plans'),
    path('form', form, name='form'),
]