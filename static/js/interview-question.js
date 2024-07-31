$(document).ready(function() {
    
    $('.mic').click(function() {
        $('.mic').toggleClass('listening');
    });

    // If anchor with id "play_question" is clicked, call text_to_speech function
    // with the text of inside div with id "question"
    var text = $('#question').text();
    $('#play_question').click(function() {
        text_to_speech(text);
    });
    
});


function evaluate_interview_question(question, user_answer) {

    // url = 'https://wda-gemini-api.azurewebsites.net/interview_question';
    url = 'https://job-api-7kowvvrmxa-de.a.run.app/interview_question'

    console.log(url)

    // Apply formData to send the data to the server
    var formData = new FormData();
    formData.append("question", question);
    formData.append("user_answer", user_answer);

    system_instruction = `
                請針對用戶對問題的回答提供
                1. 評價 / 建議，每個部分50字。
                2. 整體表現評分 (1-10, with one digit after decimal point)。
                請以繁體中文回答，返回JSON格式的結果。
            `;
    formData.append("system_instruction", system_instruction);

    $.ajax({
        url: url,
        type: 'POST',
        headers: {
			"Access-Control-Request-Methods": "POST",
			// "X-CSRFToken": csrfToken,
			"Access-Control-Allow-Origin": "http://127.0.0.1:8000",
			// "Access-Control-Request-Headers": "x-requested-with",
		},
        data: formData,
        crossDomain: true,
        processData: false,
		contentType: false,
        success: function(data) {
            console.log(data);
            
			// Hide the interview question header
			var interview_question_header = document.getElementById('interview_question_header');
            interview_question_header.classList.add('hide_this');

            // $('#interview_question_header').css('visibility', 'hidden');
            $('#interview_question_result').css('visibility', 'visible');

            $('#interview_question_score').css('visibility', 'visible');
            $('#interview_question_score').append('<h3 style="text-align: center;">' + "Score" + '</h3>');
            if (data["analysis"] == null) {
                $('#interview_question_score').append('<h4 style="font-size: 30px; text-align: center; color: #3d82db;">' + '<strong>' + data["整體表現評分"] + '</strong>' + " / 10" + '</h4>');
            }

			$('#interview_question_evaluation').css('visibility', 'visible');
            $('#interview_question_evaluation').append('<h3 style="text-align: center;">' + "Evaluation" + '</h3>');
            if (data["evaluation"] == null) {
                $('#interview_question_evaluation').append('<p>' + data["評價"] + '</p>');
            }

			$('#interview_question_suggestion').css('visibility', 'visible');
            $('#interview_question_suggestion').append('<h3 style="text-align: center;">' + "Suggestion" + '</h3>');
            if (data["suggested_modification"] == null) {
                $('#interview_question_suggestion').append('<p>' + data["建議"] + '</p>');
            }

            $('.loading').css('visibility', 'hidden');
        },
        error: function(err) {
            console.error(err);
            alert("Error occured. Please try again.");
        },
    });
}