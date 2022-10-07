from django.urls import path
from . import views


urlpatterns = [
    path('update/',views.editProfile),
    path('get-user-data/',views.get_user_data),
    path('search/',views.search),
    path('<str:user_id>/follow/',views.follow_user),
    path('<str:username>/',views.profile),
    path('<str:username>/followers/',views.get_followers),
    path('<str:username>/following/',views.get_following),
]