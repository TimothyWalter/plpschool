
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('buyer','Buyer'),('seller','Seller'),('company','Company'),('employee','Employee'),('admin','Admin')
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return f'{self.username} ({self.role})'
