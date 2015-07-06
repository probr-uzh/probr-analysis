from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

class VendorListView(ListAPIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, format=None):
        content = {'user_count':50}
        return Response(content)
