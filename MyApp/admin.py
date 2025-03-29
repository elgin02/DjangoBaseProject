from django.contrib import admin
from MyApp.models import MyUser, ZipCode
# Register your models here.

admin.site.register(MyUser)
admin.site.register(ZipCode)