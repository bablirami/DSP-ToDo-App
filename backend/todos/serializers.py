from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = "__all__"

    def validate_title(self, value: str) -> str:
        cleaned = (value or "").strip()
        if not cleaned:
            raise serializers.ValidationError("Title darf nicht leer sein.")
        if len(cleaned) > 200:
            raise serializers.ValidationError("Title darf max. 200 Zeichen haben.")
        return cleaned

    def to_internal_value(self, data):
        # Тримим title/description на входе
        data = data.copy()
        if "title" in data and isinstance(data["title"], str):
            data["title"] = data["title"].strip()
        if "description" in data and isinstance(data["description"], str):
            data["description"] = data["description"].strip()
        return super().to_internal_value(data)
