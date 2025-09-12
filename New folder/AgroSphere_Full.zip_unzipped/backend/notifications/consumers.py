
import json
from channels.generic.websocket import AsyncWebsocketConsumer
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'notifications_global'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(json.dumps({'type':'welcome','message':'Connected to AgroSphere notifications'}))
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            await self.send(text_data)
    async def notify(self, event):
        payload = event.get('payload', {})
        await self.send(json.dumps({'type':'notification','payload':payload}))
