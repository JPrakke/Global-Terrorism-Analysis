from django.urls import path, include
from . import views


app_name = 'back_end'

urlpatterns = [
    path('', views.api, name='API'),
    path('attack-info/<year_input>/<group_input>', views.attack_info, name='Attack Info'),
    path('populate/', views.populate, name='populate lists'),
    path('metadata/<year_input>/<group_input>', views.metadata, name ='metadata list' ),
    path('coord/<year_input>/<group_input>', views.location, name='coords for map'),
    path('images/', views.images, name='img archive'),
]