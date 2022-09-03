from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import ProfileSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request,username):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        is_author = False
        if request.user.username == username:
            is_author = True
        context = {
            'request':request
        }
        user_obj = ProfileSerializer(user.author,context=context)
        response_obj = {
            'statusCode': 6000,
            'data':user_obj.data,
            'is_author':is_author
        }
        return Response(response_obj)
    else:
        response_obj = {
            'statusCode':6001,
            'message': 'User not found'
        }
        return Response(response_obj)