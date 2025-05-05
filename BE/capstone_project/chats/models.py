from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from profiles.models import Profile

class ChatSession(models.Model):
    """Chat sessions between users"""
    STATUS_CHOICES = (
        ('active', _('Active')),
        ('closed', _('Closed')),
    )
    
    # Thay thế suggestion bằng trường liên kết đến Profile (tùy chọn)
    related_profile = models.ForeignKey(
        Profile, 
        on_delete=models.SET_NULL, 
        related_name='related_chat_sessions',
        null=True, blank=True,
        help_text=_("Profile that initiated the chat")
    )
    status = models.CharField(_("Status"), max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat session {self.id} created at {self.created_at}"

class ChatParticipant(models.Model):
    """Participants in a chat session"""
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_participations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'user')

    def __str__(self):
        return f"{self.user.username} in session {self.session.id}"

class Message(models.Model):
    """Messages in a chat session"""
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField(_("Content"))
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(_("Is read"), default=False)

    class Meta:
        ordering = ['sent_at']

    def __str__(self):
        return f"Message from {self.sender.username} in session {self.session.id}"
