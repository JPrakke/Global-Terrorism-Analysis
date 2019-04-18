# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class GlobalTerrorism(models.Model):
    iyear = models.BigIntegerField(blank=True, null=True)
    imonth = models.BigIntegerField(blank=True, null=True)
    iday = models.BigIntegerField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    country_txt = models.TextField(blank=True, null=True)
    region_txt = models.TextField(blank=True, null=True)
    provstate = models.TextField(blank=True, null=True)
    city = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    multiple = models.BigIntegerField(blank=True, null=True)
    success = models.BigIntegerField(blank=True, null=True)
    suicide = models.BigIntegerField(blank=True, null=True)
    attacktype1_txt = models.TextField(blank=True, null=True)
    attacktype2_txt = models.TextField(blank=True, null=True)
    attacktype3_txt = models.TextField(blank=True, null=True)
    targtype1_txt = models.TextField(blank=True, null=True)
    targsubtype1_txt = models.TextField(blank=True, null=True)
    corp1 = models.TextField(blank=True, null=True)
    natlty1_txt = models.TextField(blank=True, null=True)
    gname = models.TextField(blank=True, null=True)
    claimmode_txt = models.TextField(blank=True, null=True)
    weaptype1_txt = models.TextField(blank=True, null=True)
    weapsubtype1_txt = models.TextField(blank=True, null=True)
    weaptype2_txt = models.TextField(blank=True, null=True)
    weapsubtype2_txt = models.TextField(blank=True, null=True)
    kidhijcountry = models.TextField(blank=True, null=True)
    ransom = models.FloatField(blank=True, null=True)
    nkill = models.FloatField(blank=True, null=True)
    nwound = models.FloatField(blank=True, null=True)
    index1 = models.FloatField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'global_terrorism'


class WorldHappinessIndex(models.Model):
    country = models.TextField(blank=True, null=True)
    year = models.BigIntegerField(blank=True, null=True)
    life_ladder = models.FloatField(blank=True, null=True)
    index1 = models.FloatField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'world_happiness_index'


class Worldnews(models.Model):
    title = models.TextField(blank=True, null=True)
    date = models.TextField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    number_of_comments = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'worldnews'
