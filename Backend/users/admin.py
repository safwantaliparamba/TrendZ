from django.contrib import admin

from .models import Author



class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name','id','image','photo_url','created_at','provider','user']



admin.site.register(Author, AuthorAdmin)