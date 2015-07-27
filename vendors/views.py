from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from packets.models import Packets
from probr.renderers import MongoRenderer
from pymongo.errors import BulkWriteError
from pymongo import TEXT
from bson.code import Code

class VendorListView(ListAPIView):
    renderer_classes = (MongoRenderer,)

    def get(self, request, format=None):

        packet_collection = Packets._get_collection()
        packet_collection.create_index([('mac_address_src', TEXT)]);

        vendors = {}
        for line in open('vendors/oui.txt', 'r'):
            line = line.lstrip().rstrip()

            if '(hex)' in line:
                oui = line[line.find('-') - 2:line.find('-') + 8].replace('-', '').rstrip().upper()
                name = line[line.find('(hex)') + 5:].lstrip()

                vendors[oui] = name

        bulk = packet_collection.initialize_unordered_bulk_op()

        for vendorMac in vendors:
            vendorString = vendors[vendorMac]

            if 'Samsung'.upper() in vendorString.upper():
                vendorString = 'Samsung'
            if 'Apple'.upper() in vendorString.upper():
                vendorString = 'Apple'
            if 'Nokia'.upper() in vendorString.upper():
                vendorString = 'Nokia'
            if 'Microsoft'.upper() in vendorString.upper():
                vendorString = 'Microsoft'

            bulk.find({'$text': {'$search': vendorMac}}).update({'$set': {'vendor': vendorString}})

        try:
            bulk.execute()
        except BulkWriteError as bwe:
            print(bwe.details)

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

        result = packet_collection.map_reduce(mapper, reducer, "vendors", query={'vendor': {'$exists': True}})

        vendors = []
        for doc in result.find({}):
            vendors.append(doc)

        return Response(vendors)
