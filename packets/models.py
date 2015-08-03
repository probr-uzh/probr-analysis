__author__ = 'Dominik'

from mongoengine import *
from drf_mongo_filters import ModelFilterset
from drf_mongo_filters import filters

class Packets(DynamicDocument):
    capture_uuid = StringField()
    mac_address_src = StringField()
    mac_address_dst = StringField()
    signal_strength = IntField()
    ssid = StringField()
    loc = PointField()
    timestamp = DateTimeField()

class PacketsFilterset(ModelFilterset):
  class Meta:
    model = Packets