from django.shortcuts import render
from decouple import config, Csv

def home(request):
    context = {
        "API_KEY":config('API_KEY'),
    }
    return render(request,'front_end/index.html', context)

def additional(request):
    return render(request,'front_end/additional.html') 
