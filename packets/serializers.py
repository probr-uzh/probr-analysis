from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework.serializers import ModelSerializer
from models import Packets

class CustomModelSerializer(ModelSerializer):

    def _include_additional_options(self, *args, **kwargs):
        return self.get_extra_kwargs()

    def _get_default_field_names(self, *args, **kwargs):
        return self.get_field_names(*args, **kwargs)

class PacketSerializer(CustomModelSerializer, DocumentSerializer):
    class Meta:
        model = Packets