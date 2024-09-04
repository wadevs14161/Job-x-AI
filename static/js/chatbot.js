$(document).ready(function() {
    console.log("chatbot.js loaded");

    welcomeMessage();

    // Set chatbox url
    setChatMode();
    
    // If button with id "chat_welfare" is clicked, call function findWelfare
    $(".chatbox").on("click", "#chat_welfare", function() {
        findWelfare();
    });

    // If button with id "chat_courses" is clicked, call function findCourses
    $(".chatbox").on("click", "#chat_courses", function() {
        findCourses();
    });
});

function welcomeMessage() {
    var welcomeMessage = document.createElement("li");
    welcomeMessage.classList.add("chat");
    welcomeMessage.classList.add("incoming");
    var spanElement = document.createElement("span");
    spanElement.classList.add("material-symbols-outlined");
    spanElement.textContent = "robot_2";
    var pElement = document.createElement("p");
    pElement.textContent = "Hello, what can I help you with?";

    welcomeMessage.appendChild(spanElement);
    welcomeMessage.appendChild(pElement);
    $(".chatbox").append(welcomeMessage);
}

function setChatMode(tab) {

    // Clear all buttons in chatbox
    $(".chatbox button").remove();

    // Clear all incoming and outgoing messages in chatbox
    $(".chatbox li").remove();

    welcomeMessage();

    // Defult tab for chatbox is "找補助" if no tab is given
    if (tab === undefined) {
        tab = "找補助";
        button_id = "chat_welfare";
    } else if (tab === "找職訓") {
        tab = "找職訓";
        button_id = "chat_courses";
    }
    var buttonElement = document.createElement("button");
    buttonElement.classList.add("btn-secondary");
    buttonElement.id = button_id;
    buttonElement.textContent = "開始" + tab;
    $(".chatbox").append(buttonElement);
}

function findWelfare() {
    console.log("findWelfare called");
    // Clear all buttons in chatbox
    $(".chatbox button").remove();

    // Declare variables for finding welfare
    var user_info = {
        gender : "",
        age : "",
        current_status : "",
        unemployment_duration : "",
        identity : "",
    }

    // Create a list of questions to ask
    var questions = [
        "請問您的性別是?",
        "請問您的年齡是?",
        "請問您目前的狀況是?",
        "請問您待業天數?",
        "請問您的身分是?"
    ];
    
    // Create a list of options for each question
    var options = [
        ["男性", "女性"],
        ["15-16", "16-18", "18-29", "30-44", "45-64", "65+"],
        ["失業尋職中", "參訓無工作", "自由工作者", "在職中", "已退休待業中", "學生"],
        ["0-14", "15-29", "30-89", "90-179", "180+"],
        ["無特定身份", "非自願離職", "中低收入戶", "身心障礙", "獨立負擔家計者", "原住民", "長期失業", "更生人", "家暴被害人", "二度就業婦女", "受災失業者", "性侵害被害人", "新住民"]
    ];

    // Ask questions and if options are clicked, assign the option value to user_info
    var questionIndex = 0;
    var optionIndex = 0;
    var questionElement = document.createElement("li");
    questionElement.classList.add("chat");
    questionElement.classList.add("incoming");
    var pElement = document.createElement("p");
    pElement.textContent = questions[questionIndex];
    questionElement.appendChild(pElement);
    $(".chatbox").append(questionElement);

    // Create options with btn-secondary for each question
    options[questionIndex].forEach(function(option) {
        var optionElement = document.createElement("button");
        optionElement.classList.add("btn-secondary");
        // Add class "welfare" to button
        optionElement.classList.add("welfare");
        optionElement.textContent = option;
        $(".chatbox").append(optionElement);
    }
    );
    
    // If button with class "btn-secondary welfare" is clicked, assign the value of the button to user_info and ask the next question
    $(".chatbox").on("click", ".btn-secondary.welfare", function() {
        user_info[Object.keys(user_info)[questionIndex]] = $(this).text();
        questionIndex += 1;
        optionIndex += 1;

        // If all questions are not answered, ask the next question
        if (questionIndex < questions.length) {
            $(".chatbox li:contains('" + questions[questionIndex - 1] + "')").replaceWith(createChatLi(questions[questionIndex], "incoming"));
            $(".chatbox button").remove();
            options[questionIndex].forEach(function(option) {
                var optionElement = document.createElement("button");
                optionElement.classList.add("btn-secondary");
                // Add class "welfare" to button
                optionElement.classList.add("welfare");
                // if questions are last set of questions, add class "last" to button
                if (questionIndex === questions.length - 1) {
                    optionElement.classList.add("last");
                }
                optionElement.textContent = option;
                $(".chatbox").append(optionElement);
            });
        }
        // only if btn-secondary with class "last" is clicked, send user_info to sendChatQuery

        else if (questionIndex === questions.length && $(this).hasClass("last")) {
            
            // Clear all btn-secondary buttons in chatbox
            $(".chatbox button").remove();

            // If all questions are answered, show user_info in chatbox
            console.log(user_info);
            user_message = "我是一名" + user_info["age"] + "歲的" + user_info["gender"] + "，目前的狀況是" + user_info["current_status"] + "，已經待業" + user_info["unemployment_duration"] + "天，身分是" + user_info["identity"] + "。";
            
            // Show user_message in chatbox
            var userMessageElement = document.createElement("li");
            userMessageElement.classList.add("chat");
            userMessageElement.classList.add("outgoing");
            var pElement = document.createElement("p");
            pElement.textContent = user_message;
            userMessageElement.appendChild(pElement);
            $(".chatbox").append(userMessageElement);
            $(".chatbox").scrollTop($(".chatbox")[0].scrollHeight);
            
            sendChatQuery(user_message, "welfare");

            // set timeout to display "思考中..." message while waiting for the response
            setTimeout(function() {
                // Append "思考中..." message to chatbox
                $(".chatbox").append(createChatLi("思考中...", "incoming"));
                $(".chatbox").scrollTop($(".chatbox")[0].scrollHeight);
            }, 500);
            
        }
    });
}

function findCourses() {
    console.log("findCourses called");

    // Clear all buttons in chatbox
    $(".chatbox button").remove();

    // Show welcome message in chatbox with "可直接輸入關鍵字或點選下方按鈕"
    var welcomeMessage = document.createElement("li");
    welcomeMessage.classList.add("chat");
    welcomeMessage.classList.add("incoming");
    var spanElement = document.createElement("span");
    spanElement.classList.add("material-symbols-outlined");
    spanElement.textContent = "robot_2";
    var pElement = document.createElement("p");
    pElement.textContent = "可直接輸入關鍵字或點選下方按鈕";
    welcomeMessage.appendChild(spanElement);
    welcomeMessage.appendChild(pElement);
    $(".chatbox").append(welcomeMessage);
        
    
    // Create three secondary buttons for finding courses respectively with "我要學照護服務", "我要學餐飲", "我要學AI"
    var courseButtons = ["我要學照護服務", "我要學餐飲", "我要學AI"];
    courseButtons.forEach(function(course) {
        var courseElement = document.createElement("button");
        courseElement.classList.add("btn-secondary");
        courseElement.textContent = course;
        $(".chatbox").append(courseElement);
    });

    // If button with class "btn-secondary" is clicked, send text in button to sendChatQuery
    $(".chatbox").on("click", ".btn-secondary", function() {
        sendChatQuery($(this).text(), "courses");

        // Show user_message in chatbox
        var userMessageElement = document.createElement("li");
        userMessageElement.classList.add("chat");
        userMessageElement.classList.add("outgoing");
        var pElement = document.createElement("p");
        pElement.textContent = $(this).text();
        userMessageElement.appendChild(pElement);
        $(".chatbox").append(userMessageElement);
        $(".chatbox").scrollTop($(".chatbox")[0].scrollHeight);
        

        setTimeout(function() {
            // Append "思考中..." message to chatbox
            $(".chatbox").append(createChatLi("思考中...", "incoming"));
            $(".chatbox").scrollTop($(".chatbox")[0].scrollHeight);
        }, 500);
    });
}