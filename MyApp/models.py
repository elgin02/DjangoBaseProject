from django.db import models

# Create your models here.
'''class UserZip(models.Model):
    user = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)

    class Meta:
        unique_together = ('user', 'zipcode')'''
class MyUser(models.Model):
    username = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.username

class ZipCode(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.user} : {self.zip_code}'
    class Meta:
        unique_together = ('user', 'zip_code') # ensures zipcode is only stored once to a user
