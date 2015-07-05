from mongoengine import connect
from django.conf import settings

connect(settings.MONGO_DB, host=settings.MONGO_URI)