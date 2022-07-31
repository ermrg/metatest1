from django.urls import path
from user_management.views import EmployeesView, UserCaptchaView, LoginView, UserMeView

urlpatterns = [
   path('get_captcha/', UserCaptchaView.as_view(),name="captcha"),
   path('web3_login/', LoginView.as_view(),name="login_view"),
   path('me/', UserMeView.as_view(),name="me_view"),   
   path('get-employee/', EmployeesView.as_view(),name="get_employees"),   
]