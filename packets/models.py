__author__ = 'Dominik'
from mongoengine import *
from drf_mongo_filters import ModelFilterset
from drf_mongo_filters import filters


class Geometry(EmbeddedDocument):
    type = StringField()
    # as 'type' is already a function in Python we have to use a different name here
    coordinates = ListField(FloatField())


class Packets(DynamicDocument):
    capture_uuid = StringField()
    mac_address_src = StringField()
    mac_address_dst = StringField()
    signal_strength = IntField()
    ssid = StringField()
    coordinates = PointField()
    # coordinates = EmbeddedDocumentField(Geometry)


class PacketsFilterset(ModelFilterset):
    filters_mapping = {
        PointField: filters.GeoDistanceFilter
    }
    class Meta:
        model = Packets
