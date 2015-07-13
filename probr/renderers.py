from __future__ import unicode_literals
from rest_framework import renderers
from bson.json_util import dumps

class MongoRenderer(renderers.JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is None:
            return bytes()

        ret = dumps(data)
        return ret

