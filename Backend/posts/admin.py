from django.contrib import admin

from .models import Posts,PostImages


class PostImagesAdmin(admin.TabularInline):
    list_display = ('image','post')
    model = PostImages


class PostAdmin(admin.ModelAdmin):
    list_display = ('author','timestamp','description','location')
    inlines = [PostImagesAdmin]

admin.site.register(Posts,PostAdmin)
# admin.site.register(PostImages,PostImagesAdmin)
