//Check if user is logged in before loading content
//if user is not logged in, redirect them to login screen
//Dont wait for content to load, redirect asap
if (!isLoggedIn()) location.href = "./login.html"

const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizId');
const userId = getUserID(); 
let questions = [];
let startTime;
let timerInterval;
let maxDuration; // Maximum duration in seconds
let alertShown = false; // Flag to track if the 15 seconds alert has been shown

function getUserID(){
    if (sessionStorage.userid != null){
      return sessionStorage.userid
  
    } else if (localStorage.userid != null){
      return localStorage.userid
    } 
  
    return null
  }

function startQuiz() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000); // Time in seconds
    const timeRemaining = maxDuration - timeElapsed;

    if (timeRemaining <= 15 && !alertShown) {
        alert('You have 15 seconds remaining!');
        alertShown = true;
    }

    if (timeElapsed >= maxDuration) {
        clearInterval(timerInterval);
        submitQuiz();
        return;
    }

    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function fetchQuizQuestions() {
    try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}/questions`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        questions = await response.json();
        displayQuestions();
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
    }
}

async function fetchQuizTitle() {
    try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();
        displayQuizTitle(quiz);
        maxDuration = quiz.duration * 60; // Convert duration from minutes to seconds
    } catch (error) {
        console.error('Error fetching quiz title:', error);
    }
}

function displayQuestions() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.text}</p>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="question-${question.id}" value="${i}"> ${option}
                </label><br>
                <br>
            `).join('')}
        `;
        container.appendChild(questionDiv);
    });
}

function displayQuizTitle(quiz) {
    const quizTitle = document.getElementById('quizTitle');
    quizTitle.innerHTML = `
        <h2 class="exo-semibold" style='font-size: 1.8vw; margin-right: 45%;'>${quiz.title}</h2>
    `;
}

async function submitQuiz() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    const userId = getUserID(); // Get the userId here

    const answers = questions.map(question => {
        const selectedOption = document.querySelector(`input[name="question-${question.id}"]:checked`);
        return {
            questionId: question.id,
            answer: selectedOption ? parseInt(selectedOption.value) : null
        };
    });

    try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizId, userId, answers, duration }) // Include userId in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`Quiz submitted successfully`);
        window.location.href = `quizResults.html?quizId=${quizId}&resultId=${result.resultId}`;
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
}



fetchQuizQuestions();
fetchQuizTitle();
window.onload = startQuiz;
