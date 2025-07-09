from django.db import models
import uuid

class Room(models.Model):
    code = models.CharField(max_length=10, unique=True, default=uuid.uuid4().hex[:6].upper())

class Participant(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
