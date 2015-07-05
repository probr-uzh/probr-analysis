from mongoengine import connect
from django.conf import settings

connect('probr-analysis', host=settings.MONGO_URI)