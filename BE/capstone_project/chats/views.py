from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import ChatSession, ChatParticipant, Message
from .serializers import ChatSessionSerializer, MessageSerializer
from profiles.models import Profile, ProfileMatchSuggestion
from notifications.models import Notification
from .supabase_utils import mark_message_as_read

User = get_user_model()

class IsParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.participants.filter(user=request.user).exists()

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        participations = ChatParticipant.objects.filter(user=user).values_list('session_id', flat=True)
        return ChatSession.objects.filter(id__in=participations)
    
    def create(self, request, *args, **kwargs):
        other_user_id = request.data.get('other_user_id')
        suggestion_id = request.data.get('suggestion_id')
        
        if not other_user_id:
            return Response({"error": "Other user ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a chat session already exists between these users
        user_participations = ChatParticipant.objects.filter(user=request.user).values_list('session_id', flat=True)
        other_user_participations = ChatParticipant.objects.filter(user_id=other_user_id).values_list('session_id', flat=True)
        
        # Find common chat sessions
        common_sessions = set(user_participations).intersection(set(other_user_participations))
        
        if common_sessions:
            # Return the existing chat session
            session = ChatSession.objects.get(id=list(common_sessions)[0])
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        
        # Create a new chat session
        session_data = {}
        if suggestion_id:
            try:
                suggestion = ProfileMatchSuggestion.objects.get(id=suggestion_id)
                session_data['suggestion'] = suggestion
            except ProfileMatchSuggestion.DoesNotExist:
                pass
        
        session = ChatSession.objects.create(**session_data)
        
        # Add participants
        ChatParticipant.objects.create(session=session, user=request.user)
        try:
            other_user = User.objects.get(id=other_user_id)
            ChatParticipant.objects.create(session=session, user=other_user)
            
            # Create notification for the other user
            Notification.objects.create(
                user=other_user,
                type='message',
                content=f"{request.user.username} started a conversation with you",
                related_entity_id=session.id
            )
        except User.DoesNotExist:
            # If the other user doesn't exist, delete the session and return error
            session.delete()
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        session = self.get_object()
        messages = session.messages.all()
        
        # Mark messages as read
        unread_messages = messages.filter(sender__id=request.user.id, is_read=False)
        for message in unread_messages:
            mark_message_as_read(message.id)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        session = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            session=session,
            sender=request.user,
            content=content
        )
        
        # Remove: sync_message_to_supabase(message)
        
        # Create notifications for other participants
        other_participants = session.participants.exclude(user=request.user)
        for participant in other_participants:
            Notification.objects.create(
                user=participant.user,
                type='message',
                content=f"New message from {request.user.username}",
                related_entity_id=session.id
            )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
