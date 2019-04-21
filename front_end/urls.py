from django.urls import path, include
from . import views


app_name = 'front_end'

urlpatterns = [
    path('', views.home, name='home'),
    path('more/', views.additional, name='More Views'),
    path('images/', views.images, name='img archive')
]