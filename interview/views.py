from django.shortcuts import render, redirect
from .forms import UploadVideoForm, MockInterviewEntryForm
from .models import *
import requests, json, random

# Create your views here.
def analysis(request):
    form = UploadVideoForm()
    if request.method == 'POST':

        # Get the video file from the form
        form = UploadVideoForm(request.POST, request.FILES)
        if form.is_valid():
            video_file = request.FILES['video_file']

            prompt = '''
                1. 請針對面試者下列的表現做出評分(1-100分):
                - 視覺評價: 1. 臉部情緒特徵(30%): 是否友善、正向、自信? 或是木訥、膽怯、害羞。 2. 肢體動作(20%): 是否沉穩、自信、大方； 3. 眼神交流 (15%)、4. 微笑是否自然 (15%)、5. 衣著整潔(20%)。
                - 聽覺評價: 1. 語速(20%): 是否太快/太慢、2. 音調(30%): 太高或太低、3. 言語和聲紋(50%): 能否展現沉穩、熱情、自信、大方、好相處的態度，抑或畏縮、沒自信。
                - 言語內容: 1. 言語用字(30%): 是否得體、2. 表達邏輯 (70%): 是否清晰、通順，抑或前後矛盾。
                
                請根據上述分析，請按權重為視覺評價、聽覺評價、言語內容，分別產生各項的總評分(1-100分):
                
                2. 請分析面試者的
                - 整體表現
                - 改進建議。
                請以繁體中文回答。
                以json格式回傳結果，格式如下:
                response = {
                    "整體表現": "",
                    "改進建議": "",
                    "聽覺評價": {"總評分": , "言語和聲紋": , "語速": , "音調": },
                    "視覺評價": {
                            "總評分": ,
                            "微笑是否自然": ,
                            "眼神交流": ,
                            "總評分": ,
                            "肢體動作": ,
                            "臉部情緒特徵": ,
                            "衣著整潔": },
                    "言語內容": {
                            "總評分": , 
                            "表達邏輯": , 
                            "言語用字": },
                }

            '''

            url = 'https://wda-gemini-api.azurewebsites.net/video'
            files = {
                'video': video_file,
                }
            data = {
                'prompt': prompt,
            }

            response = requests.post(url, files=files, data=data)

            if response.status_code == 200:                
                
                print("Response status code: ", response.status_code)

                # Replace ' with " in the response
                response_text = response.text.replace("'", '"')
                
                # Load the response text to json format
                response_json = json.loads(response_text)

                from pprint import pprint
                pprint(response_json)

                # print(type(response_json))

                # print(response_json["改進建議"])
                # print(response_json["整體表現"])

                # Overall score
                overall_score = (response_json["視覺評價"]["總評分"] + response_json["聽覺評價"]["總評分"] + response_json["言語內容"]["總評分"]) / 3
                # Show overall score in integer
                overall_score = int(overall_score)


                context = {
                    'response_json': response_json,
                    'overall_score': overall_score,
                }

                # Write the video file to the local directory staic/user/user.mp4
                with open('static/videos/user/user.mp4', 'wb+') as destination:
                    for chunk in video_file.chunks():
                        destination.write(chunk)

                return render(request, 'analysis.html', context)
            else:
                context = {
                    'form': form,
                    'error': 'Error occurs when uploading the video file. Please try again later.'
                }
                return render(request, 'analysis.html', context)
        

    context = {
        'form': form,
    }
    return render(request, 'analysis.html', context)

def mock_interview_entry(request):
    if request.method == 'POST':
        # Get job type
        job = request.POST.get("job")

        # return render(request, 'mock-interview.html', context)
        return redirect(mock_interview, job=job)

    form = MockInterviewEntryForm()

    context = {
        'form': form
    }

    return render(request, 'interview.html', context=context)

def mock_interview(request, job):

    questions = ''
    # Query question sets
    if job == "General":
        questions = interview_question.objects.values_list('question', flat=True)
    elif job == "Software Engineer":
        questions = interview_q_software_engineering.objects.values_list('question', flat=True)
    elif job == "UI Designer":
        questions = interview_q_ui_designer.objects.values_list('question', flat=True)
    elif job == "UX Designer":
        questions = interview_q_ux_designer.objects.values_list('question', flat=True)
    
    question = random.choice(questions)

    context = {
        'question': question
    }

    context = {
        'question': question,
        # 'question_zh': question_zh,
    }
    return render(request, 'mock-interview.html', context)