from django.test import TestCase
from rest_framework.test import APIClient
from todos.models import Todo

BASE = "/api/todos/"

class TestTodoApi(TestCase):
    def setUp(self):
        self.client = APIClient()
        Todo.objects.create(title="A eins", description="x", status="offen")
        Todo.objects.create(title="B zwei", description="y", status="in_bearbeitung")
        Todo.objects.create(title="C drei", description="z", status="erledigt")

    def _items(self, payload):
        return payload["results"] if isinstance(payload, dict) and "results" in payload else payload

    def test_list(self):
        r = self.client.get(BASE)
        assert r.status_code == 200
        payload = r.json()
        assert len(self._items(payload)) >= 3

    def test_create_validation(self):
        r = self.client.post(BASE, {"title": "   "}, format="json")
        assert r.status_code == 400
        assert "title" in r.json()

    def test_create_ok(self):
        r = self.client.post(BASE, {"title": "Neu", "description": "ok"}, format="json")
        assert r.status_code == 201
        assert r.json()["title"] == "Neu"

    def test_update(self):
        todo_id = Todo.objects.first().id
        r = self.client.put(f"{BASE}{todo_id}/", {"title": "Upd", "description": "", "status": "offen"}, format="json")
        assert r.status_code == 200
        assert r.json()["title"] == "Upd"

    def test_delete(self):
        todo_id = Todo.objects.last().id
        r = self.client.delete(f"{BASE}{todo_id}/")
        assert r.status_code == 204

    def test_search(self):
        r = self.client.get(BASE, {"search": "zwei"})
        assert r.status_code == 200
        items = self._items(r.json())
        assert any("zwei" in i["title"].lower() for i in items)

    def test_status_filter(self):
        r = self.client.get(BASE, {"status": "offen"})
        assert r.status_code == 200
        items = self._items(r.json())
        assert items and all(i["status"] == "offen" for i in items)

    def test_ordering(self):
        r = self.client.get(BASE, {"ordering": "title"})
        assert r.status_code == 200
