from django.urls import path
from .views import create_room, join_room

urlpatterns = [
    path('api/create-room/', create_room),
    path('api/join-room/', join_room),
]