const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizId');

async function fetchQuizDetails() {
    try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();
        displayQuizDetails(quiz);
    } catch (error) {
        console.error('Error fetching quiz details:', error);
    }
}

function displayQuizDetails(quiz) {
    const quizDetails = document.getElementById('quizDetails');
    quizDetails.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
        <p>Total Questions: ${quiz.totalQuestions}</p>
        <p>Duration: ${quiz.duration} min</p>
        <a href="quizQuestions.html?quizId=${quiz.id}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Start</a>
    `;
}

fetchQuizDetails();