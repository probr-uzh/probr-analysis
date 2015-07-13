from base_settings import *
import mimetypes

BROKER_URL = 'redis://localhost:6379/0'
MONGO_URI = 'mongodb://localhost/probr-core'
MONGO_DB = 'probr-core'

# Compress
COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc {infile} {outfile}'),
)