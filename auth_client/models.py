from django.db import models

# Create your models here.
class User(models.Model):
    full_name = models.CharField(max_length=300)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name