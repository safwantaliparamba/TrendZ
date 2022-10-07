from django.contrib import admin

from .models import Posts,PostImages,Comment


class PostImagesAdmin(admin.TabularInline):
    list_display = ('image','post')
    model = PostImages

class CommentsAdmin(admin.TabularInline):
    list_display = ('id','message')
    model = Comment


class PostAdmin(admin.ModelAdmin):
    list_display = ('author','timestamp','description','location')
    inlines = [PostImagesAdmin,CommentsAdmin]

admin.site.register(Posts,PostAdmin)
# admin.site.register(PostImages,PostImagesAdmin)
