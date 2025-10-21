from django.urls import path
from . import views


urlpatterns = [
    path('details/<int:id>', views.user_details, name='user_details'),
    path('details/verify/<int:id>', views.verify_user, name='verify_user'),
]