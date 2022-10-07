from django.contrib.auth.models import User
from rest_framework import serializers
from users.models import Author


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'username', 'email')




class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    isFollowing = serializers.SerializerMethodField()
    followings_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ('id','name','user','image','bio','created_at','isFollowing','followings_count','followers_count')
        # exclude = ('saved_posts',)

    def get_isFollowing(self, instance):
        request = self.context.get('request', None)
        user = request.user.author
        if user.following.filter(id=instance.id).exists():
            return True
        else:
            return False

    def get_followings_count(self, instance):
        return instance.following.count()

    def get_followers_count(self, instance):
        return instance.followers.count()


class EditAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('name', 'bio')


class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email',)


class GetAuthor(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id','name', 'bio', 'image')


class SearchSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'image', 'id')

    def get_image(self, instance):
        request = self.context.get('request', None)
        return request.build_absolute_uri(instance.author.image.url)

class FollowingSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Author
        fields = ('id','image','username')

    def get_username(self, instance):
        return instance.user.username