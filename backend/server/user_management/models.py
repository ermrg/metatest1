from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager
)


class UserManager(BaseUserManager):

    def create_user(self, web3_address):

        if web3_address is None:
            raise TypeError('Users must have an web3_address.')

        user = self.model(web3_address=web3_address)
        user.save()

        return user

    def create_superuser(self, web3_address):

        user = self.create_user(web3_address)
        user.is_superuser = True
        user.save()

        return user

        
class Web3User(AbstractBaseUser):
    web3_address = models.CharField(max_length=100,unique=True)
    role = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=100, null=True)
    age = models.CharField(max_length=100, null=True)
    sex = models.CharField(max_length=100, null=True)
    ssn = models.CharField(max_length=100, null=True)
    salary = models.CharField(max_length=100, null=True)
    title = models.CharField(max_length=100, null=True)
    password = None
    objects = UserManager()


    USERNAME_FIELD = 'web3_address'
    REQUIRED_FIELDS = []

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser

# Create your models here.
class UserCaptcha(models.Model):
    captcha = models.CharField(max_length=100)
    user = models.ForeignKey(Web3User, on_delete=models.CASCADE)
    class Meta:
        db_table = "user_captcha"
