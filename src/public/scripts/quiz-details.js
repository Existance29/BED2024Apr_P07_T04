//Check if user is logged in before loading content
//if user is not logged in, redirect them to login screen
//Dont wait for content to load, redirect asap
guardLoginPage()

const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizId');
const userId = getUserID();

function getUserID(){
    if (sessionStorage.userid != null){
        return sessionStorage.userid;
    } else if (localStorage.userid != null){
        return localStorage.userid;
    } 
    return null;
}

async function fetchQuizDetails() {
    try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();

        const attemptResponse = await fetch(`http://localhost:3000/quizzes/attempt/${quizId}/${userId}`);
        if (!attemptResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const attemptDetails = await attemptResponse.json();

        console.log('Quiz:', quiz);  // Debugging logs
        console.log('Attempt Details:', attemptDetails);  // Debugging logs

        displayQuizDetails(quiz, attemptDetails);
    } catch (error) {
        console.error('Error fetching quiz details:', error);
    }   
}

function displayQuizDetails(quiz, attemptDetails) {
    const quizDetails = document.getElementById('quizDetails');
    quizDetails.innerHTML = `
        <h2>${quiz.title}</h2>
        <p>${quiz.description}</p>
        <p>Total Questions: ${quiz.totalQuestions}</p>
        <p>Duration: ${quiz.duration} min</p>
        <p>Attempts: ${attemptDetails.attempts}/${attemptDetails.maxAttempts}</p>  <!-- Corrected attempt details display -->
        ${attemptDetails.canAttempt ? 
            `<a href="quizQuestions.html?quizId=${quiz.id}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Start</a>` :
            `<p style="color: red;">You have reached the maximum number of attempts for this quiz.</p>`
        }
    `;
}

fetchQuizDetails();
