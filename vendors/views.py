from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from packets.models import Packets
from probr.renderers import MongoRenderer
from django.db import connection, IntegrityError

class VendorListView(ListAPIView):
    renderer_classes = (MongoRenderer, )

    def get(self, request, format=None):

        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS oui")
        cursor.execute("CREATE TABLE IF NOT EXISTS oui(oui TEXT PRIMARY KEY, name TEXT)")

        count = 0;

        print('open oui database')
        inputfile = open('vendors/oui.txt', 'r')

        for line in inputfile:
            line = line.lstrip()
            line = line.rstrip()

            if '(hex)' in line:
                oui = line[line.find('-')-2:line.find('-')+8].replace('-', '')
                name = line[line.find('(hex)')+5:].lstrip()

                try:
                    insertSTMT = 'INSERT INTO oui(oui, name) VALUES(%s, %s)'
                    cursor.execute(insertSTMT, [oui, name])
                    count += 1
                except IntegrityError:
                    print('integrity error')

        print('done inserting - ' + count)

        vendors = []
        collection = Packets._get_collection()
        cursor = connection.cursor()

        for packet in collection.find({}):
            cursor.execute("SELECT * FROM oui WHERE oui = %s LIMIT 1", [packet['mac_address_src'][0:6]])
            manufacturer = cursor.fetchone()

            if manufacturer != None:
                print manufacturer
                vendors[manufacturer].count += 1

        print vendors
        return Response(vendors)
