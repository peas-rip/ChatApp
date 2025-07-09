import json
from channels.generic.websocket import AsyncWebsocketConsumer

# In-memory storage for active users per room
active_users = {}  # Format: { "room_code": {channel_name: nickname} }

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'chat_{self.room_code}'
        self.nickname = None  # Will be set after receiving 'join' message

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from active_users
        if self.room_code in active_users and self.channel_name in active_users[self.room_code]:
            del active_users[self.room_code][self.channel_name]

        # Broadcast updated user list
        await self.send_user_list()

        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data['type']

        if message_type == 'join':
            self.nickname = data['nickname']

            # Initialize room if not exists
            if self.room_code not in active_users:
                active_users[self.room_code] = {}

            # Store nickname against channel
            active_users[self.room_code][self.channel_name] = self.nickname

            # Notify others (optional)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'system_message',
                    'message': f"{self.nickname} joined the chat."
                }
            )

            # Broadcast updated user list
            await self.send_user_list()

        elif message_type == 'chat_message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'nickname': self.nickname,
                    'message': data['message']
                }
            )

        elif message_type == 'typing_indicator':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_indicator',
                    'nickname': self.nickname,
                    'is_typing': data['is_typing']
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'nickname': event['nickname'],
            'message': event['message']
        }))

    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'message': event['message']
        }))

    async def typing_indicator(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing_indicator',
            'nickname': event['nickname'],
            'is_typing': event['is_typing']
        }))

    async def send_user_list(self):
        # Send updated user list to everyone
        if self.room_code in active_users:
            user_list = [
                {'id': channel, 'nickname': name}
                for channel, name in active_users[self.room_code].items()
            ]
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_list',
                    'users': user_list
                }
            )

    async def user_list(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_list',
            'users': event['users']
        }))
