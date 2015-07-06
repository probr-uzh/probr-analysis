from django.conf.urls import url
from views import VendorListView

urlpatterns = [

    #get vendor stats
    url(r'^api/vendors/$', VendorListView.as_view(), name='vendor-list'),

]