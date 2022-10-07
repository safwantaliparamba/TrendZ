from django.urls import path
from . import views

urlpatterns = [
    path('all/',views.get_posts),
    path('create-new/',views.create_post),
    path('saved-posts/',views.saved_posts),
    path('<str:post_id>/',views.get_post),
    path('<str:post_id>/update/',views.update_post),
    path('<str:post_id>/delete/',views.delete_post),
    path('<str:post_id>/like/',views.like_post),
    path('<str:post_id>/save-post/',views.save_post),
    path('<str:post_id>/comments/create/',views.create_comment),
    path('comments/<str:comment_id>/delete/',views.delete_comment),
]