from django.shortcuts import render

def index(request):
    return render(request,'front_end/index.html')

def additional(request):
    return render(request,'front_end/additional.html')