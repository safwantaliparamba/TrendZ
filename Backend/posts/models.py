from datetime import datetime
from django.db import models
# from django.utils import timezone

from users.models import Author

class Posts(models.Model):
    author = models.ForeignKey(Author,related_name='posts',on_delete=models.CASCADE)
    likes = models.ManyToManyField(Author, related_name='liked_posts')
    location = models.CharField(max_length=255,null=True,blank=True)
    timestamp = models.DateTimeField(default=datetime.now())
    description = models.TextField(null=True,blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.author.name
    
    class Meta:
        verbose_name = 'Posts'
        verbose_name_plural = 'Posts'

class PostImages(models.Model):
    image = models.FileField(upload_to='posts/')
    post = models.ForeignKey(Posts,related_name='images',on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Post Images'
        verbose_name_plural = 'Post Images'


class Comment(models.Model):
    message = models.CharField(max_length=255)
    author = models.ForeignKey(Author,related_name='comments',on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, related_name='comments',on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return self.author.name

    class Meta:
        verbose_name = 'Posts'
        verbose_name_plural = 'Posts'