from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.hashers import make_password, check_password
import json

from auth_client.models import User
from utils.jwt_authenticator import generate_jwt
# Create your views here.


# Create your views here.
def login(request):
    if request.method == 'POST':
        # Handle login logic here
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                # Login successful
                return JsonResponse(
                    {
                        'status': 'success',
                        'message': 'Login successful',
                        'token': generate_jwt(user.id),
                        'user': 
                            {
                                'id': user.id,
                                'full_name': user.full_name,
                                'email': user.email,
                                'profile_image': user.profile_image.url if user.profile_image else None,
                                'bio': user.bio,
                                'created_at': user.created_at,
                                'updated_at': user.updated_at,
                            }
                        
                    }
                )
            else:
                # Invalid password
                return JsonResponse(
                    {
                        'status': 'error',
                        'message': 'Invalid Password'
                    }
                )
        except User.DoesNotExist:
            # User not found
            return JsonResponse(
                {
                    'status': 'error',
                    'message': 'User not found'
                }
            )
        
    elif request.method == 'GET':
        # Render the login form
        return render(request, 'login.html')
    else:
        return HttpResponse('Method Not Allowed', status=405)

def register(request):
    if request.method == 'POST':
        # Handle registration logic here
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            profile_image = None
        else:
            data = request.POST
            profile_image = request.FILES.get('profile_image')
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')
        bio = data.get('bio')

        try:
            user = User.objects.create(
                full_name=full_name,
                email=email,
                password=make_password(password),
                profile_image=profile_image,
                bio=bio,
            )
            return JsonResponse(
                {
                    'status': 'success',
                    'message': 'Registration successful'
                }
            )
        except Exception as e:
            return JsonResponse(
                {
                    'status': 'error',
                    'message': str(e)
                }
            )
    elif request.method == 'GET':
        # Render the registration form
        return render(request, 'signup.html')
    else:
        return HttpResponse('Method Not Allowed', status=405)