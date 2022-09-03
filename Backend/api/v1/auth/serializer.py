from rest_framework.serializers import ModelSerializer
from users.models import Author


class NormalSignupSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ('name',)


class SocialSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ('name','photo_url','uid','provider')