from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room, Participant

@api_view(['POST'])
def create_room(request):
    room = Room.objects.create()
    return Response({"room_code": room.code})

@api_view(['POST'])
def join_room(request):
    room_code = request.data.get('room_code')
    nickname = request.data.get('nickname')
    if not room_code or not nickname:
        return Response({"error": "Missing data"}, status=400)
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)
    if Participant.objects.filter(room=room).count() >= 5:
        return Response({"error": "Room full"}, status=403)
    Participant.objects.create(room=room, nickname=nickname)
    return Response({"success": True})