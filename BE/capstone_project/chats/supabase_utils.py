def mark_message_as_read(message_id):
    try:
        message = Message.objects.get(id=message_id)
        message.is_read = True
        message.save()
        # Remove: supabase.table('chat_messages').update({...})
        return message
    except Exception as e:
        print(f"Lỗi khi đánh dấu tin nhắn đã đọc: {e}")