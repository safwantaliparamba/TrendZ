from rest_framework import serializers
from posts.models import Posts,PostImages
from users.models import Author


class AuthorSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Author
        fields = ('id','username','image')

    def get_username(self,instance):
        return instance.user.username


class PostImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImages
        fields = ('image',)

class PostSerializer(serializers.ModelSerializer):
    images = PostImagesSerializer(many=True)
    author = AuthorSerializer(read_only=True)
    likes = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    isSaved = serializers.SerializerMethodField()
    class Meta:
        model = Posts 
        fields = ('id','images','author','location','timestamp','description','likes','isLiked','isSaved')

    def get_likes(self,instance):
        return instance.likes.count()

    def get_isLiked(self,instance):
        request = self.context.get('request',None)
        if request:
            user = request.user.author 
            if user.liked_posts.filter(id=instance.id).exists():
                return True
            else:
                return False
        else:
            return False

    def get_isSaved(self, instance):
        request = self.context.get('request',None)
        if request:
            user = request.user.author 
            if user.saved_posts.filter(id=instance.id).exists():
                return True 
            else:
                return False 
        else:
            return False         