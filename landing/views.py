from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from auth_client.models import User

# Create your views here.
def user_details(request, id):
    return render(request, 'details.html')


def verify_user(request, id):
    # JWT verification
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    token = auth_header.split(' ', 1)[1]
    from utils.jwt_authenticator import verify_jwt
    user_id = verify_jwt(token)
    if not isinstance(user_id, int):
        return JsonResponse({'error': 'Invalid token'}, status=401)
    # Only allow access if token user matches requested user
    if int(user_id) != int(id):
        return JsonResponse({'error': 'Forbidden'}, status=403)
    user = User.objects.filter(id=id).first()
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({
        'user': {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'profile_image': user.profile_image.url if user.profile_image else 'https://ui-avatars.com/api/?name=Avatar&size=160&background=6d28d9&color=fff',
            'bio': user.bio,
            'created_at': user.created_at.strftime('%b %d, %Y %H:%M'),
            'updated_at': user.updated_at.strftime('%b %d, %Y %H:%M'),
        }
    })