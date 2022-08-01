from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from user_management.models import Web3User, UserCaptcha
from user_management.serializers import Web3UserSerializer
from user_management.validators import LoginPostValidator
from rest_framework.authtoken.models import Token
import configparser
import random
from eth_account.messages import encode_defunct
from web3.auto import w3
from rest_framework.pagination import LimitOffsetPagination


sys_random = random.SystemRandom()
def get_random_string(k=35):
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    return ''.join(sys_random.choices(letters, k=k))

# get_captcha
class UserCaptchaView(APIView):
    address_param = openapi.Parameter('web3_address', openapi.IN_QUERY, description="web3 address", type=openapi.TYPE_STRING, required=True)
    @swagger_auto_schema(manual_parameters=[address_param])
    def get(self,request,*args,**kwargs):
        content = {}
        # get the address from params
        address = request.GET.get('web3_address')
        # if user not exists
        role = request.GET.get('role')
        if not Web3User.objects.filter(web3_address=address).exists():
            # create one
            Web3User(
                web3_address = address,
                role = role
            ).save()
        
        user_obj = Web3User.objects.get(web3_address=address)

        # if user_obj.role == "employee":

        # delete all the old captchas of this user 
        UserCaptcha.objects.filter(user=user_obj).delete()
        # create a new captcha
        captcha = get_random_string()
        # assign it
        user_captcha_obj = UserCaptcha(
            captcha = captcha,
            user=user_obj
        )
        user_captcha_obj.save()

        content["data"] = {"captcha": user_captcha_obj.captcha}
        content["message"] = "successfully executed!"
        return Response(content, status = status.HTTP_200_OK)

# web3_login
class LoginView(APIView):

    @swagger_auto_schema(request_body=LoginPostValidator)
    def post(self,request,*args,**kwargs):
        content = {}
        serializer = LoginPostValidator(data=request.data)
        # check if request data is valid
        if serializer.is_valid():
            data = request.data
            print(data["signature"],data["web3_address"])
            # check if user exists 
            if Web3User.objects.filter(web3_address=data["web3_address"]).exists():
                user = Web3User.objects.get(web3_address=data["web3_address"])
                # get the captcha from db 
                if UserCaptcha.objects.filter(user=user).exists():
                    captcha = UserCaptcha.objects.get(user=user)
                    message = encode_defunct(text=captcha.captcha)
                    # derive public key using the provided signature and captcha  
                    pub2 = w3.eth.account.recover_message(message, signature=data["signature"])
                    # check if public key matches
                    if user.web3_address == pub2:
                        # create the access token
                        token, created = Token.objects.get_or_create(user=user)
                        UserCaptcha.objects.filter(user=user).delete()
                        serializer = Web3UserSerializer(user)
                        # emps = serializer.get_employees()
                        content["data"] = serializer.data
                        # content["employees"] = emps
                        content["token"] = token.key
                        return Response(content, status = status.HTTP_200_OK)
                    content["message"] = "signature not valid"
                    return Response(content, status = status.HTTP_400_BAD_REQUEST)
                content["message"] = "captcha not found" 
                return Response(content, status = status.HTTP_400_BAD_REQUEST) 
            content["message"] = "user not yet created"
            return Response(content, status = status.HTTP_400_BAD_REQUEST) 
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST) 

# me
class UserMeView(APIView):
    
    permission_classes = (IsAuthenticated,)
    def get(self,request,*args,**kwargs):
        content = {}
        serializer = Web3UserSerializer(Web3User.objects.get(pk = request.user.id))
        content["data"] = serializer.data
        content["message"] = "successfully fetched!"
        return Response(content, status = status.HTTP_200_OK)


# me
class EmployeesView(APIView,LimitOffsetPagination):
    permission_classes = (IsAuthenticated,)
    @swagger_auto_schema()
    def get(self,request,*args,**kwargs):
        content = {}
        qs = Web3User.objects.filter(role='employee')
        query = self.request.query_params.get('query')
        if query is not None:
            qs = qs.filter(name__icontains=query)
        results = self.paginate_queryset(qs, request, view=self)
        serializer = Web3UserSerializer(results, many=True)
        content["data"] = serializer.data
        content["message"] = "successfully fetched!"
        return self.get_paginated_response(serializer.data)

class EmployeeView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request, pk=None, *args,**kwargs):
        content = {}
        id = pk or kwargs.get('pk')
        serializer = Web3UserSerializer(Web3User.objects.get(pk = id))
        content["data"] = serializer.data
        content["message"] = "successfully fetched!"
        return Response(content, status = status.HTTP_200_OK)
    
    # web3_address = openapi.Parameter('web3_address', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True)
    name = openapi.Parameter('name', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    email = openapi.Parameter('email', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    sex = openapi.Parameter('sex', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    address = openapi.Parameter('address', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    ssn = openapi.Parameter('ssn', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    age = openapi.Parameter('age', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    salary = openapi.Parameter('salary', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    title = openapi.Parameter('title', openapi.IN_QUERY, type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[name, email, address, ssn, age, sex, salary, title])
    def put(self, request, pk, format=None,*args,**kwargs):        
        user = Web3User.objects.get(pk = pk)
        inputData = request.data
        inputData['web3_address'] =  user.web3_address
        # fix here
        serializer = Web3UserSerializer(user, data=inputData)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

