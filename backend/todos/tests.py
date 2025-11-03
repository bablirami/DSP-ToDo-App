from django.test import TestCase
from rest_framework.test import APIClient
from .models import Todo

BASE = "/api/todos/"

class TodoApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Todo.objects.create(title="A eins", description="x", status="offen")
        Todo.objects.create(title="B zwei", description="y", status="in_bearbeitung")
        Todo.objects.create(title="C drei", description="z", status="erledigt")

    def test_list(self):
        r = self.client.get(BASE)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(len(r.json()) >= 3 or "results" in r.json())  # c пагинацией

    def test_create_validation(self):
        r = self.client.post(BASE, {"title": "   "}, format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("title", r.json())

    def test_create_ok(self):
        r = self.client.post(BASE, {"title": "Neu", "description": "ok"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json()["title"], "Neu")

    def test_update(self):
        todo_id = Todo.objects.first().id
        r = self.client.put(f"{BASE}{todo_id}/", {"title": "Upd", "description": "", "status": "offen"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["title"], "Upd")

    def test_delete(self):
        todo_id = Todo.objects.last().id
        r = self.client.delete(f"{BASE}{todo_id}/")
        self.assertEqual(r.status_code, 204)

    def test_search(self):
        r = self.client.get(BASE, {"search": "zwei"})
        self.assertEqual(r.status_code, 200)
        payload = r.json()
        items = payload["results"] if isinstance(payload, dict) and "results" in payload else payload
        self.assertTrue(any("zwei" in i["title"].lower() for i in items))

    def test_status_filter(self):
        r = self.client.get(BASE, {"status": "offen"})
        self.assertEqual(r.status_code, 200)
        payload = r.json()
        items = payload["results"] if isinstance(payload, dict) and "results" in payload else payload
        self.assertTrue(all(i["status"] == "offen" for i in items))

    def test_ordering(self):
        r = self.client.get(BASE, {"ordering": "title"})
        self.assertEqual(r.status_code, 200)
