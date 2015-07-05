from rest_framework import generics
from rest_framework_mongoengine.serializers import DocumentSerializer
from packets.models import Packet
from probr import mongodb

#Devices
##################################################
class PacketListView(generics.ListCreateAPIView):
    queryset = Packet.objects.all()
    serializer_class = DocumentSerializer

class PacketDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer

    def get_object(self):
        id = self.kwargs['id']
        return Packet.objects.get(_id=id)