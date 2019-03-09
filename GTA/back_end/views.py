from django.shortcuts import render , get_object_or_404
from django.http import HttpResponse , JsonResponse
from .models import GlobalTerrorism
from django.db.models import Sum



def api(request):
    return HttpResponse("Hello, API!")

def years(request):
    """ returns list of availible years """
    list = {"year":[]}
    for value in GlobalTerrorism.objects.values('iyear').distinct():
        list["year"].append(value["iyear"])
        print(value)
    return JsonResponse(list)


def metadata(request, year_input):
    """ returns metadata on specific year """
    num_attacks = GlobalTerrorism.objects.values('index1').\
        filter(iyear=year_input).count()
    num_kill = GlobalTerrorism.objects.filter(iyear=year_input).\
        aggregate(Sum('nkill'))
    num_wound = GlobalTerrorism.objects.filter(iyear=year_input).\
        aggregate(Sum('nwound'))

    year_metadata = {
        "Total Attacks":num_attacks,
        "Total Fatalities":num_kill['nkill__sum'],
        "Total Wounded":num_wound['nwound__sum'],
    }
    return JsonResponse(year_metadata)

def location(request, year_input):
    """ returns lat and long for each attack by year"""
    list = []
    for value in GlobalTerrorism.objects.values('latitude', 'longitude').filter(iyear=year_input):
        list.append(value)
    print(list[0]['latitude'])
    print(list[0]['longitude'])

    return JsonResponse(list, safe=False)
