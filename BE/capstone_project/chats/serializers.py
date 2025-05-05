from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatSession, ChatParticipant, Message

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar_url']

class MessageSerializer(serializers.ModelSerializer):
    sender_details = UserBasicSerializer(source='sender', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'session', 'sender', 'content', 'sent_at', 'is_read', 'sender_details']
        read_only_fields = ['id', 'sender', 'sent_at', 'sender_details']

class ChatParticipantSerializer(serializers.ModelSerializer):
    user_details = UserBasicSerializer(source='user', read_only=True)
    
    class Meta:
        model = ChatParticipant
        fields = ['id', 'session', 'user', 'joined_at', 'user_details']
        read_only_fields = ['id', 'joined_at', 'user_details']

class ChatSessionSerializer(serializers.ModelSerializer):
    participants = ChatParticipantSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'suggestion', 'status', 'created_at', 'participants', 'last_message', 'other_user']
        read_only_fields = ['id', 'created_at', 'participants', 'last_message', 'other_user']
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-sent_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            other_participant = obj.participants.exclude(user=request.user).first()
            if other_participant:
                return UserBasicSerializer(other_participant.user).data
        return None