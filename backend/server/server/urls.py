from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static
from django.conf import settings


schema_view = get_schema_view(
   openapi.Info(
      title="REST API DOCS",
      default_version='v1',
      description="Employee - Employer Portal",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
   path('api-auth/', include('rest_framework.urls')),
   path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   path('user_svc/', include('user_management.urls'),name="user"),

]
urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
