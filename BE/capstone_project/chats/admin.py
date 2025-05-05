from django.contrib import admin
from .models import ChatSession, ChatParticipant, Message

admin.site.register(ChatSession)
admin.site.register(ChatParticipant)
admin.site.register(Message)
