from django.db.models import Q

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from posts.models import Posts, Comment
from .serializer import PostSerializer, PostIdSerializer, CommentsSerializer
from posts.models import Posts, PostImages


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    following_users = request.user.author.following.all()
    posts = []

    for user in following_users:
        user_posts = user.posts.all()
        for post in user_posts:
            posts.append(post)

    # sorted_posts = posts.sort(key = lambda post: post['timestamp'])
    post_instances = PostSerializer(
        posts, many=True, context={'request': request})

    return Response(post_instances.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    author = request.user.author

    if Posts.objects.filter(id=post_id).exists():
        post = Posts.objects.get(id=post_id)

        if author.liked_posts.filter(id=post_id).exists():
            post.likes.remove(author)
            like_count = post.likes.count()
            response_obj = {
                'status': 'success',
                'liked': False,
                'count': like_count
            }
            return Response(response_obj)
        else:
            post.likes.add(author)
            like_count = post.likes.count()
            response_obj = {
                'status': 'success',
                'liked': True,
                'count': like_count
            }
            return Response(response_obj)
    else:
        response_obj = {
            'statusCode': 6001,
            'message': 'Post Not Found',
        }
        return Response(response_obj)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def save_post(request, post_id):
    author = request.user.author
    post = Posts.objects.get(id=post_id)

    if author.saved_posts.filter(id=post_id).exists():
        author.saved_posts.remove(post)

        response_obj = {
            'status': 'success',
            'saved': False
        }

        return Response(response_obj)

    else:
        author.saved_posts.add(post)
        response_obj = {
            'status': 'success',
            'saved': True
        }

        return Response(response_obj)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    images = request.data.getlist('images')
    print(len(images))

    new_post = Posts.objects.create(
        author=request.user.author,
        description=request.data['description'],
        location=request.data['location']
    )
    for image in images:
        print(image)
        PostImages.objects.create(
            post=new_post,
            image=image
        )

    post = PostSerializer(new_post, context={'request': request})
    response_obj = {
        'statusCode': 6000,
        'data': post.data
    }

    return Response(response_obj)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, post_id):
    if Posts.objects.filter(Q(id=post_id) | Q(is_deleted=False)).exists():
        post = Posts.objects.get(id=post_id)
        post_instance = PostSerializer(post, context={'request': request})

        response_data = {
            'statusCode': 6000,
            'data': post_instance.data
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'Post not found'
        }
        return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_posts(request):
    print('saved posts')
    posts = request.user.author.saved_posts.all()
    posts = posts.filter(is_deleted=False)
    posts_instance = PostIdSerializer(
        posts, many=True, context={'request': request})

    response_data = {
        'statusCode': '6000',
        'data': posts_instance.data
    }
    return Response(response_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    if Posts.objects.filter(id=post_id).exists():
        post = Posts.objects.get(id=post_id)
        post.is_deleted = True
        post.save()
        response_data = {
            'statusCode': 6000,
            'message': f'post with id {post_id} is deleted successfully'
        }
        return Response(response_data)
    response_data = {
        'statusCode': 6000,
        'message': f'post with {post_id} is deleted successfully'
    }
    return Response(response_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, post_id):
    if Posts.objects.filter(id=post_id).exists():
        description = request.data.get('description')
        location = request.data.get('location')
        post = Posts.objects.get(id=post_id)
        post.description = description
        post.location = location
        post.save()
        response_data = {
            'statusCode': 6000,
            'message': 'post updated successfully'
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'post not found'
        }
        return Response(response_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    message = request.data.get('message')
    if message is not None:
        author = request.user.author
        post = Posts.objects.get(id=post_id)
        new_comment = Comment.objects.create(
            author=author,
            message=message,
            post=post
        )
        serialized_data = CommentsSerializer(
            new_comment, context={'request': request})

        response_data = {
            'statusCode': 6000,
            'data': serialized_data.data
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'message': 'Comment message cannot be blank'
        }
        return Response(response_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    comment = Comment.objects.get(id=comment_id)
    if request.user.author == comment.author:
        comment.delete()
        response_data = {
            'statusCode': 6000,
            'deleted': True
        }
        return Response(response_data)
    else:
        response_data = {
            'statusCode': 6001,
            'deleted': False
        }
        return Response(response_data)
