from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from packets.models import Packets
from probr.renderers import MongoRenderer
from mongoengine import connection
from bson.code import Code

class VendorListView(ListAPIView):
    renderer_classes = (MongoRenderer,)

    def get(self, request, format=None):

        packet_collection = Packets._get_collection()
        print('open oui database')

        vendors = {}
        for line in open('vendors/oui.txt', 'r'):
                line = line.lstrip().rstrip()

                if '(hex)' in line:
                    oui = line[line.find('-') - 2:line.find('-') + 8].replace('-', '').rstrip().upper()
                    name = line[line.find('(hex)') + 5:].lstrip()

                    vendors[oui] = name

        for uncategorizedPacket in packet_collection.find({'vendor': {'$exists': False}}):
            mac_to_compare = uncategorizedPacket['mac_address_src'][0:6].upper()

            if vendors.get(mac_to_compare, None):
                packet_collection.update({'_id': uncategorizedPacket['_id']}, {'$set': {'vendor': vendors[mac_to_compare]}}, upsert=False, multi=False)

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
