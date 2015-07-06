from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from packets.models import Packets, PacketsFilterset
from packets.serializers import PacketSerializer
from drf_mongo_filters import MongoFilterBackend

#Devices
##################################################
class PacketListView(ListCreateAPIView):
    filter_backends = (MongoFilterBackend,)
    filter_class = PacketsFilterset
    serializer_class = PacketSerializer
    queryset = Packets.objects.all()

class PacketDetailsView(RetrieveUpdateDestroyAPIView):
    serializer_class = PacketSerializer
    queryset = Packets.objects.all()
    lookup_field = 'id'