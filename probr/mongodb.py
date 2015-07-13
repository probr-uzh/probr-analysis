from mongoengine import connect
from probr import settings

connect(settings.MONGO_DB, host=settings.MONGO_URI)