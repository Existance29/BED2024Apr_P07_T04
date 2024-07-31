let questions = [];
let correctAnswers = [];
let startTime;
let timerInterval;
let maxDuration;
let alertShown = false;

function startQuiz() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
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

async function fetchRandomQuiz() {
    try {
        const response = await fetch(`http://localhost:3000/api/questions`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();
        displayQuiz(quiz);
        console.log('Random quiz:', quiz);
        questions = quiz.questions;
        correctAnswers = quiz.questions.map(q => q.correctAnswer);
        maxDuration = quiz.duration * 60;
        
        // Hide loading screen and show quiz content
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'block';
        
        // Start the quiz timer
        startQuiz();
    } catch (error) {
        console.error('Error fetching random quiz:', error);
    }
}

function displayQuiz(quiz) {
    const quizTitle = document.getElementById('quizTitle');
    quizTitle.innerHTML = `
        <h2 class="exo-semibold" style='font-size: 1.8vw; margin-right: 45%;'>${quiz.title}</h2>
        <br>
    `;

    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.text}</p>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="question-${index}" value="${i}"> ${option}
                </label>
                <br>
            <br>
            `).join('')}
        `;
        container.appendChild(questionDiv);
    });
}

async function submitQuiz() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds

    const answers = questions.map((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        return {
            questionId: index,
            answer: selectedOption ? parseInt(selectedOption.value) : null
        };
    });

    try {
        const response = await fetch(`http://localhost:3000/random-quizzes/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Include the JWT token
            },
            body: JSON.stringify({ answers, duration, questions }) // Include questions in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`Quiz submitted successfully`);
        window.location.href = `random-quiz-results.html`;
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRandomQuiz();
});
