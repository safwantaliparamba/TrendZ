from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from users.models import Author


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','username','email')


class ProfileSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Author
        exclude = ('saved_posts',)


class EditAuthorSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ('name','bio')

class EditUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('email',)

class GetAuthor(ModelSerializer):
    class Meta:
        model = Author
        fields = ('name','bio','image')