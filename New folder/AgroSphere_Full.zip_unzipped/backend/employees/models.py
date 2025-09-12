
from django.db import models

class Employee(models.Model):
    ROLE_CHOICES = [('cashier','Cashier'),('manager','Manager'),('it','IT'),('shipping','Shipping'),('loader','Loader')]
    name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=20, unique=True)
    employee_number = models.CharField(max_length=20, unique=True)
    gender = models.CharField(max_length=10, choices=[('male','Male'),('female','Female')])
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    def __str__(self):
        return f'{self.name} ({self.role})'
