from django.urls import path
from user_management.views import EmployeeView, EmployeesView, UserCaptchaView, LoginView, UserMeView

urlpatterns = [
   path('get_captcha/', UserCaptchaView.as_view(),name="captcha"),
   path('login/', LoginView.as_view(),name="login_view"),
   path('me/', UserMeView.as_view(),name="me_view"),   
   path('employees/', EmployeesView.as_view(),name="get_employees"),   
   path('employee/<int:pk>/', EmployeeView.as_view(),name="get_employee_by_id"),   
   # path('employee/update/<int:pk>/', EmployeeView.as_view(),name="get_employee_by_id"),   
]