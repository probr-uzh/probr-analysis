from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from packets.models import Packets
from probr.renderers import MongoRenderer
from bson.code import Code

class UtilizationListView(ListAPIView):
    renderer_classes = (MongoRenderer,)

    def get(self, request, format=None):

        packet_collection = Packets._get_collection()

        mapper = Code("""
                        function () {
                            emit(this.vendor, 1)
                        }
                        """)

        reducer = Code("""
                        function (key, values) {
                            var total = 0;
                            for (var i = 0; i < values.length; i++) {
                                total += values[i];
                            }
                            return total;
                        }
                        """)

        result = packet_collection.map_reduce(mapper, reducer, "vendors")
        vendors = []
        for doc in result.find({}):
            vendors.append(doc)

        return Response(vendors)
