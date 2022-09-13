from django.urls import path
from . import views

urlpatterns = [
    path('all/',views.get_posts),
    path('create-new/',views.create_post),
    path('<str:post_id>/like/',views.like_post),
    path('<str:post_id>/save-post/',views.save_post),
]