from django.shortcuts import render , get_object_or_404
from django.http import HttpResponse , JsonResponse
from .models import GlobalTerrorism
from django.db.models import Sum ,Count



def api(request):
    return HttpResponse("Hello, API!")

def populate(request):
    """ returns list of availible years and top 10 terrorist groups"""
    list = {"year":[],
            "group": [
                "All",
                "Taliban",
                "Islamic State of Iraq and the Levant (ISIL)",
                "Al-Shabaab",
                "Communist Party of India - Maoist (CPI-Maoist)",
                "Boko Haram",
                "New People's Army (NPA)",
                "Maoists",
                "Tehrik-i-Taliban Pakistan (TTP)",
                "Revolutionary Armed Forces of Colombia (FARC)",
                "Kurdistan Workers' Party (PKK)"
                ],
            }
    for value in GlobalTerrorism.objects.values('iyear').distinct():
        list["year"].append(value["iyear"])
    # for value in GlobalTerrorism.objects.values('gname').annotate(tcount=Count('index1')).order_by('-tcount')[1:11]:
    #     list["group"].append(value['gname'])
    return JsonResponse(list)

def metadata(request, year_input, group_input):
    """ returns metadata on specific year """
    if group_input == "All":
        num_attacks = GlobalTerrorism.objects.values('index1').\
            filter(iyear=year_input).count()
        num_kill = GlobalTerrorism.objects.filter(iyear=year_input).\
            aggregate(Sum('nkill'))
        num_wound = GlobalTerrorism.objects.filter(iyear=year_input).\
            aggregate(Sum('nwound'))
    else:
        num_attacks = GlobalTerrorism.objects.values('index1').\
            filter(iyear=year_input, gname=group_input).count()
        num_kill = GlobalTerrorism.objects.filter(iyear=year_input, gname=group_input).\
            aggregate(Sum('nkill'))
        num_wound = GlobalTerrorism.objects.filter(iyear=year_input, gname=group_input).\
            aggregate(Sum('nwound'))

    year_metadata = {
        "Total Attacks":num_attacks,
        "Total Fatalities":num_kill['nkill__sum'],
        "Total Wounded":num_wound['nwound__sum'],
    }
    return JsonResponse(year_metadata)


def location(request, year_input, group_input):
    """ returns lat and long for each attack by year"""
    list = []
    if group_input == "All":
        for value in GlobalTerrorism.objects.values('latitude', 'longitude').filter(iyear=year_input):
            list.append(value)
    else:
        for value in GlobalTerrorism.objects.values('latitude', 'longitude').filter(iyear=year_input,gname=group_input):
            list.append(value)
    return JsonResponse(list, safe=False)
