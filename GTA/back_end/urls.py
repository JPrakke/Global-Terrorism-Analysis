from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.api, name="API"),
    path('years/', views.years, name="year list"),
    path('metadata/<year_input>/', views.metadata, name ="metadata list" ),
    path('coord/<year_input>/', views.location, name="coords for map"),
]