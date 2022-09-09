from django.urls import path
from . import views

urlpatterns = [
    path('all/',views.get_posts),
    # path('get-user-data/',views.get_user_data),
    # path('<str:username>/',views.profile),
]