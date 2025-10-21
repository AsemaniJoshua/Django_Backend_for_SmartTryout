from django.contrib import admin

from auth_client.models import User

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'is_active', 'created_at')
    search_fields = ('full_name', 'email')
    list_filter = ('is_active', 'created_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(User, UserAdmin)