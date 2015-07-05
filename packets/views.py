from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from packets.models import Packets
from packets.serializers import PacketSerializer

#Devices
##################################################
class PacketListView(ListCreateAPIView):
    serializer_class = PacketSerializer
    queryset = Packets.objects.all()

class PacketDetailsView(RetrieveUpdateDestroyAPIView):
    serializer_class = PacketSerializer
    queryset = Packets.objects.all()