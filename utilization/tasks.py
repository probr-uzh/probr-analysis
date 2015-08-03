__author__ = 'ale'


@shared_task
def processCapture(captureUUID):
    capture = Capture.objects.get(pk=captureUUID)
    for handlerString in PROBR_HANDLERS:
        klass = recursiveImport(handlerString)
        handler = klass()
        handler.handle(capture)