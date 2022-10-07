import base64
from django.contrib.auth.models import User
from django.core.files.base import ContentFile

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import ProfileSerializer, EditAuthorSerializer, EditUserSerializer, GetAuthor, SearchSerializer,FollowingSerializer
from users.models import Author
from api.v1.posts.serializer import PostSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request, username):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        posts = user.author.posts.filter(
            is_deleted=False).order_by('-timestamp')

        is_author = False
        if request.user.username == username:
            is_author = True
        context = {
            'request': request
        }
        user_obj = ProfileSerializer(user.author, context=context)
        post_obj = PostSerializer(posts, many=True, context=context)
        response_obj = {
            'statusCode': 6000,
            'data': user_obj.data,
            'is_author': is_author,
            'posts': post_obj.data
        }
        return Response(response_obj)
    else:
        response_obj = {
            'statusCode': 6001,
            'message': 'User not found'
        }
        return Response(response_obj)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    q = request.GET.get('q')
    users_instance = User.objects.filter(username__icontains=q)
    if users_instance:
        users = SearchSerializer(
            users_instance, many=True, context={'request': request})

        response_data = {
            'statusCode': 6000,
            'users': users.data
        }
        return Response(response_data)
    response_data = {
        'statusCode': 6001,
        'users': 'user not found'
    }
    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    if Author.objects.filter(id=user_id).exists():
        author = request.user.author
        other_user = Author.objects.get(id=user_id)

        if not author.following.filter(id=user_id).exists():
            author.following.add(other_user)
            other_user.refresh_from_db()
            followers_count = other_user.followers.count()
            response_data = {
                'statusCode': 6000,
                'isFollowing': True,
                'followersCount': followers_count,
                'message': f'following {other_user.user.username} successfully'
            }
            return Response(response_data)
        else:
            author.following.remove(other_user)
            other_user.refresh_from_db()
            followers_count = other_user.followers.count()

            response_data = {
                'statusCode': 6000,
                'isFollowing': False,
                'followersCount': followers_count,
                'message': f'unfollowing {other_user.user.username} successfully'
            }
            return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'user not found'
        }
        return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request, username):
    if User.objects.filter(username=username).exists():
        user = Author.objects.get(user__username=username)
        followers_instance = user.followers.all()
        followers = FollowingSerializer(
            followers_instance, many=True, context={'request': request})
        response_data = {
            'statusCode': 6000,
            'data': followers.data
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'user not found'
        }
        return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_following(request, username):
    if User.objects.filter(username=username).exists():
        user = Author.objects.get(user__username=username)
        followers_instance = user.following.all()
        followers = FollowingSerializer(
            followers_instance, many=True, context={'request': request})
        response_data = {
            'statusCode': 6000,
            'data': followers.data
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'user not found'
        }
        return Response(response_data)
