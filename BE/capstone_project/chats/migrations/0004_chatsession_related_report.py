# Generated by Django 5.2 on 2025-06-03 09:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0003_alter_chatparticipant_id_alter_chatsession_id_and_more'),
        ('recently_missing', '0008_alter_missingpersonmatchresult_llm_confidence'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatsession',
            name='related_report',
            field=models.ForeignKey(blank=True, help_text='Missing person report that initiated the chat', null=True, on_delete=django.db.models.deletion.SET_NULL, to='recently_missing.recentlymissingreport'),
        ),
    ]
