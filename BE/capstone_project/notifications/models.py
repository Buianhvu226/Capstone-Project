from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Notification(models.Model):
    """Notifications for users"""
    TYPE_CHOICES = (
        ('match', _('Profile Match')),
        ('message', _('New Message')),
        ('system', _('System Notification')),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(_("Type"), max_length=20, choices=TYPE_CHOICES)
    content = models.TextField(_("Content"))
    related_entity_id = models.IntegerField(_("Related entity ID"), null=True, blank=True)
    is_read = models.BooleanField(_("Is read"), default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_type_display()} for {self.user.username}"
        