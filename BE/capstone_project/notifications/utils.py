import os
from django.conf import settings
from supabase import create_client, Client
from .models import Notification

# Khởi tạo Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def create_notification(user, notification_type, content, related_entity_id=None):
    """
    Tạo thông báo và lưu vào Django DB
    """
    notification = Notification.objects.create(
        user=user,
        type=notification_type,
        content=content,
        related_entity_id=related_entity_id,
        is_read=False
    )
    return notification

def mark_notification_as_read(notification_id):
    """
    Đánh dấu thông báo đã đọc
    """
    notification = Notification.objects.get(id=notification_id)
    notification.is_read = True
    notification.save()
    return notification

def mark_all_notifications_as_read(user_id):
    """
    Đánh dấu tất cả thông báo của user là đã đọc
    """
    Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)