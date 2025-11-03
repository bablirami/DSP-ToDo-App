from rest_framework import viewsets, filters
from rest_framework.request import Request
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "status"]
    ordering_fields = ["title", "status"]

    def get_queryset(self):
        qs = Todo.objects.all().order_by("id")
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs
