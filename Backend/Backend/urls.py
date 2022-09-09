from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('api.v1.auth.urls')),
    path('api/v1/users/', include('api.v1.users.urls')),
    path('api/v1/posts/', include('api.v1.posts.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
