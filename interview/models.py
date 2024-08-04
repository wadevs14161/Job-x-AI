from django.db import models

# Create your models here.
class interview_question(models.Model):
    question_competency = models.CharField(max_length=200)
    question = models.TextField()
    question_zh = models.TextField(default=None, blank=True, null=True)

    def __str__(self):
        return self.question_competency
    
class interview_q_software_engineering(models.Model):
    question = models.TextField()
    answer = models.TextField()

class interview_q_ux_designer(models.Model):
    question = models.TextField()

class interview_q_ui_designer(models.Model):
    question = models.TextField()
    sample_answer = models.TextField()

