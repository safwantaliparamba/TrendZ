# Generated by Django 4.1 on 2022-09-28 02:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_alter_posts_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2022, 9, 28, 8, 19, 32, 772749)),
        ),
    ]