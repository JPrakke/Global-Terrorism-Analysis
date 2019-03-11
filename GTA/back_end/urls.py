from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.api, name="API"),
    path('populate/', views.populate, name="populate lists"),
    path('metadata/<year_input>/<group_input>', views.metadata, name ="metadata list" ),
    path('coord/<year_input>/<group_input>', views.location, name="coords for map"),
]