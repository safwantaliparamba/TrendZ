from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from posts.models import Posts
from .serializer import PostSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    posts = Posts.objects.all()
    post_instances = PostSerializer(posts, many=True,context={'request': request})

    return Response(post_instances.data)
