from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from posts.models import Posts
from .serializer import PostSerializer
from posts.models import Posts,PostImages


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    posts = Posts.objects.all().order_by('-timestamp')
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

    post = PostSerializer(new_post,context={'request': request})
    response_obj = {
        'statusCode':6000,
        'data':post.data
    }

    return Response(response_obj)