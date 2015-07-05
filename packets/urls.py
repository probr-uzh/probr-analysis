from django.conf.urls import patterns, url
from views import PacketListView, PacketDetailsView

urlpatterns = [
    #Devices

    #list of all packets
    url(r'^api/packets/$', PacketListView.as_view(), name='packet-list'),

    #details of a packet by its mongoid
    url(r'^api/packets/(?P<uuid>[^/]+)/+$', PacketDetailsView.as_view(), name='packet-details'),
    ###########################################

]