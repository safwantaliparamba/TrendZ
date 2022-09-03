import uuid

from django.db import models
from django.contrib.auth.models import User



class Author(models.Model):
    name = models.CharField(max_length=255)
    user = models.OneToOneField(User, related_name='author',on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile/',null=True, blank=True)
    photo_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    uid = models.CharField(max_length=255,null=True,blank=True)
    provider = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name