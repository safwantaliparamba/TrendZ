import base64
from django.contrib.auth.models import User
from django.core.files.base import ContentFile

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import ProfileSerializer, EditAuthorSerializer, EditUserSerializer, GetAuthor
from users.models import Author


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request, username):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        is_author = False
        if request.user.username == username:
            is_author = True
        context = {
            'request': request
        }
        user_obj = ProfileSerializer(user.author, context=context)
        response_obj = {
            'statusCode': 6000,
            'data': user_obj.data,
            'is_author': is_author
        }
        return Response(response_obj)
    else:
        response_obj = {
            'statusCode': 6001,
            'message': 'User not found'
        }
        return Response(response_obj)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def updateImage(request):
#     data_ = request.data.get('image')
#     format, imgstr = data_.split(';base64,')
#     ext = format.split('/')[-1]
#     user = request.user.author
#     data = ContentFile(base64.b64decode(imgstr), name=f'{user.name}.' + ext)

#     print(data)

#     author = Author.objects.get(pk=user.id)
#     author.image = data
#     author.save()
#     return Response('success')


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def editProfile(request):
    user = request.user
    author = user.author

    if request.method == 'PATCH':
        image = request.data.get('image')

        author_instance = Author.objects.get(id=request.user.author.pk)
        user_instance = User.objects.get(id=request.user.pk)

        author_data = EditAuthorSerializer(
            instance=author_instance, data=request.data, partial=True)
        user_data = EditUserSerializer(
            instance=user_instance, data=request.data, partial=True)

        # converting base64 image into normal image type
        final_image = False
        if len(image) > 100:
            format, imgstr = image.split(';base64,')
            ext = format.split('/')[-1]
            final_image = ContentFile(base64.b64decode(
                imgstr), name=f'{user.username}.' + ext)

        if author_data.is_valid() and user_data.is_valid():
            user_data.save()
            if final_image:
                author_data.save(image=final_image)
            else:
                author_data.save()
            user.refresh_from_db()
            author.refresh_from_db()
            author_updated = GetAuthor(author, context={'request': request})
            updated_image = author_updated.data['image']

            response_obj = {
                'statusCode': 6000,
                'message': 'Profile updated successfully',
                'userData': {
                    'username': user.username,
                    'image': updated_image
                }
            }

            return Response(response_obj)

        return Response('something went wrong')

    if request.method == 'GET':
        user_data = EditUserSerializer(user)
        author_data = GetAuthor(user.author, context={'request': request})

        response_obj = {
            'userData': user_data.data,
            'author_data': author_data.data,
        }

        return Response(response_obj)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    user.refresh_from_db()
    author_data = GetAuthor(user.author, context={'request': request})
    image = author_data.data['image']

    response_data = {
        'username': user.username,
        'image': image
    }

    return Response(response_data)


