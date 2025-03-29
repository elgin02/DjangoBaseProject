from django.contrib.sites import requests
from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from MyApp.models import MyUser, ZipCode

# Create your views here.
class Home(View):
    def get(self, request):
        #users = UserZip.objects.all().values('user')
        #print(users)
        return render(request, 'home.html', {})

class User(View):
    def post(self, request):
        username = request.POST.get("username")
        #print("please")
        if username:
            #user = User.objects.filter(username=username)
            if not MyUser.objects.filter(username=username).exists():
                user = MyUser(username=username)
                user.save()

            try:
                user = MyUser.objects.get(username=username)
                user_data = ZipCode.objects.filter(user=user).values('zip_code')
            except MyUser.DoesNotExist:
                return JsonResponse({"error": "Does not exist"}, status=400)

            return JsonResponse(list(user_data), safe=False)
            # Return the queried data as a JSON response

        return JsonResponse({"error": "Username is required"}, status=400)

class AddZip(View):
    def post(self, request):
        # Adds the zipcode into the user
        username = request.POST.get("username")
        zipcodeInput = request.POST.get("zipcode", None)

        if username and zipcodeInput:
            print(username, zipcodeInput)
            '''if not MyUser.objects.filter(username=username).exists():
                user = MyUser(username=username)
                user.save()
            
            user.save()'''
            user, created = MyUser.objects.get_or_create(username=username)
            if not ZipCode.objects.filter(user=user, zip_code=zipcodeInput).exists():
               # user = MyUser(username=username)
                zipcode = ZipCode(user=user)
                zipcode.zip_code = zipcodeInput
                zipcode.save()

            try:
               # user = MyUser.objects.get(username=username)
                user_data = ZipCode.objects.filter(user=user).values('zip_code')
            except MyUser.DoesNotExist:
                return JsonResponse({"error": "Does not exist"}, status=400)

            return JsonResponse(list(user_data), safe=False)

        return JsonResponse({"error": "Username and zipcode is required"}, status=400)
        #return render(request, 'home.html', {})