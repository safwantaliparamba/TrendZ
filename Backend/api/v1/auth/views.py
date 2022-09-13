import json
import requests
import wget

from django.contrib.auth.models import User
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import NormalSignupSerializer, SocialSerializer
from users.models import Author


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not User.objects.filter(username=username).exists() and not User.objects.filter(email=email).exists():

        serialized_data = NormalSignupSerializer(data=data)

        if serialized_data.is_valid():
            user = User.objects.create_user(
                username=username, email=email, password=password)
            serialized_data.save(user=user)

            ssl = 'http'
            if request.is_secure():
                ssl = 'https'
            host = request.get_host()
            url = f'{ssl}://{host}/api/v1/auth/login/'

            headers = {
                'Content-Type': 'application/json'
            }
            data = {
                'username': username,
                'password': password
            }
            result = requests.post(
                url, headers=headers, data=json.dumps(data)).json()

            response_obj = {
                'statusCode': 6000,
                'title': 'success',
                'data': result,
                'userData': {
                    'username': username
                }
            }
            return Response(response_obj)
        else:
            response_obj = {
                'statusCode': 6001,
                'message': 'something went wrong'
            }
            return Response(response_obj)
    else:
        response_obj = {
            'statusCode': 6001,
            'message': 'User already exists'
        }
        return Response(response_obj)


@api_view(['POST'])
@permission_classes([AllowAny])
def social_auth(request):
    username = request.data.get('username')
    password = 'Safwan@#12'
    uid = request.data.get('uid')

    if not Author.objects.filter(uid=uid).exists() and not User.objects.filter(username=username).exists() :
        print('author not found')
        social_serializer = SocialSerializer(data=request.data)
        if social_serializer.is_valid():
            user = User.objects.create_user(
                username=username,
                email=request.data.get('email'),
                password=password
            )
            image_url = request.data.get('photo_url')
            filename = f'{uid}.jpg'
            filepath = f'{settings.BASE_DIR}/media/profile/{filename}'

            image = wget.download(image_url, filepath)
            social_serializer.save(user=user, image=image)

            ssl = 'http'
            if request.is_secure():
                ssl = 'https'
            host = request.get_host()
            url = f'{ssl}://{host}/api/v1/auth/login/'

            headers = {
                'Content-Type': 'application/json'
            }
            data = {
                'username': username,
                'password': password
            }
            result = requests.post(
                url, headers=headers, data=json.dumps(data)).json()

            user_image = Author.objects.get(uid=uid).image
            response_obj = {
                'statusCode': 6000,
                'message': 'success',
                'data': result,
                'userData': {
                    'username': username,
                    'image': f'{ssl}://{host}/media/{image}/'
                }
            }

            return Response(response_obj)
        else:
            response_obj = {
                'statusCode': 6001,
                'message': 'Error occured while processing'
            }
            return Response(response_obj)

    else:
        print('user found')
        ssl = 'http'
        if request.is_secure():
            ssl = 'https'
        host = request.get_host()
        url = f'{ssl}://{host}/api/v1/auth/login/'

        headers = {
            'Content-Type': 'application/json'
        }
        data = {
            'username': username,
            'password': password
        }
        result = requests.post(
            url, headers=headers, data=json.dumps(data)).json()
        # user_image = Author.objects.get(uid=uid)
        user = User.objects.get(username=username)
        user_image = user.author.image

        response_obj = {
            'statusCode': 6000,
            'message': 'success',
            'data': result,
            'userData': {
                'username': username,
                'image': f'{ssl}://{host}/media/{user_image}/'
            }
        }

        return Response(response_obj)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    ssl = 'http'
    if request.is_secure():
        ssl = 'https'
    host = request.get_host()
    url = f'{ssl}://{host}/api/v1/auth/login/'

    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'username': username,
        'password': password
    }
    result = requests.post(
        url, headers=headers, data=json.dumps(data))

    if 'detail' in result.json():
        response_obj = {
            'statusCode': 6001,
            'message':'Username or password is incorrect'
        }
        return Response(response_obj)


    # user = User.objects.get(username=username)
    user = get_object_or_404(User, username=username)
    image = user.author.image
    profile_image = None
    if image:
        profile_image = f'{ssl}://{host}/media/{image}/'
    response_obj = {
        'statusCode': 6000,
        'token': result.json(),
        'userData': {
            'username': username,
            'image': profile_image
        }
    }

    return Response(response_obj)
