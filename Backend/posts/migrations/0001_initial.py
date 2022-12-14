# Generated by Django 4.1 on 2022-09-06 11:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Posts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='users.author')),
                ('likes', models.ManyToManyField(related_name='liked_posts', to='users.author')),
            ],
            options={
                'verbose_name': 'Posts',
                'verbose_name_plural': 'Posts',
            },
        ),
        migrations.CreateModel(
            name='PostImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(upload_to='posts/')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='posts.posts')),
            ],
        ),
    ]
