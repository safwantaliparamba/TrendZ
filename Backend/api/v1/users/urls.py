from django.urls import path
from . import views


urlpatterns = [
    path('update/',views.editProfile),
    path('get-user-data/',views.get_user_data),
    path('<str:username>/',views.profile),
]