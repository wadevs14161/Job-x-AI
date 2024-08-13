from django import forms

class UploadVideoForm(forms.Form):
    video_file = forms.FileField(label='Select a video file')

class MockInterviewEntryForm(forms.Form):
    job = forms.ChoiceField(widget=forms.Select(),
                            choices=[
                                ('General', 'General'),
                                ('Software Engineer', 'Software Engineer'),
                                ('UI Designer', 'UI Designer'),
                                ('UX Designer', 'UX Designer'),
                            ])