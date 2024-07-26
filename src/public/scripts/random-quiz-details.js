// Check if user is logged in before loading content
// If user is not logged in, redirect them to login screen
// Don't wait for content to load, redirect asap
guardLoginPage();

async function fetchRandomQuizDetails() {
    try {
        const response = await get(`http://localhost:3000/api/questions`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();

        console.log('Quiz:', quiz);  // Debugging logs

        displayQuizDetails(quiz);
    } catch (error) {
        console.error('Error fetching random quiz details:', error);
    }
}

function displayQuizDetails(quiz) {
    const quizDetails = document.getElementById('quizDetails');
    quizDetails.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
        <p>Total Questions: ${quiz.totalQuestions}</p>
        <p>Duration: ${quiz.duration} min</p>
        <a href="quizQuestions.html?quizId=${quiz.quizId}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Start</a>
    `;
}

fetchRandomQuizDetails();
