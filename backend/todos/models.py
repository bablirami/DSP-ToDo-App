from django.db import models
class Todo(models.Model):
    STATUS_CHOICES = [
        ('offen', 'Offen'),
        ('in_bearbeitung', 'In Bearbeitung'),
        ('erledigt', 'Erledigt'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offen')
    def __str__(self): return self.title
