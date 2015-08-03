from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from packets.models import Packets
from probr.renderers import MongoRenderer
from bson.code import Code

class UtilizationListView(ListAPIView):
    renderer_classes = (MongoRenderer,)

    def get(self, request, format=None):
        if "max-utilization" in request.query_params:
            result = Packets.objects.aggregate({
                        "$group":{
                            "_id":{"$dateToString":{"format":"%Y-%m-%d-%H","date":"$timestamp"}},
                            "count":{"$sum":1}
                        }
                    } , {
                        "$sort":{"count":-1}
            })
            days = []
            for doc in result:
                days.append(doc)

            return Response(days)

        if "punchcard" in request.query_params:
            result = Packets.objects.aggregate({
                        "$group":{
                            "_id":{"$dateToString":{"format":"%w-%H","date":"$timestamp"}},
                            "count":{"$sum":1}
                        }
                    })

            days = []
            for doc in result:
                days.append(doc)

            return Response(days)