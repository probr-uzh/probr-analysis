__author__ = 'Dominik'
from mongoengine import *

class Packets(DynamicDocument):
    capture_uuid = StringField()
    mac_address_src = StringField()
    mac_address_dst = StringField()
    signal_strength = IntField()
    ssid = StringField()
