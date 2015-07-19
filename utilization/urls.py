from django.conf.urls import url
from views import UtilizationListView

urlpatterns = [

    #get vendor stats
    url(r'^api/utilization/$', UtilizationListView.as_view(), name='utilization-list'),

]