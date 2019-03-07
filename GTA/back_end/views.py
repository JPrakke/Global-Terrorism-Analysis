from django.shortcuts import render
from django.http import HttpResponse

def api(request):
    return HttpResponse("Hello, API!")
