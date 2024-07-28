// Check if user is logged in before loading content
// If user is not logged in, redirect them to login screen
// Don't wait for content to load, redirect asap
guardLoginPage();

const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
const role = sessionStorage.getItem("role") || localStorage.getItem("role");

console.log('Role:', role); // Debugging log

document.addEventListener('DOMContentLoaded', () => {
    if (role === 'lecturer') {
        document.getElementById('uploadQuizBtn').style.display = 'inline';
        document.getElementById('uploadQuizBtn').addEventListener('click', () => {
            window.location.href = 'create-quiz.html';
        });
    }
});

async function fetchQuizzes() {
    try {
        const response = await get('http://localhost:3000/quizzes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quizzes = await response.json();
        displayQuizzes(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}

function displayQuizzes(quizzes) {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '';
    quizzes.forEach(quiz => {
        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz';

        const buttons = (role === 'lecturer') ? `
        <button class="delete-btn btn section-text" type="button" onclick="confirmDeleteQuiz('${quiz.id}')" style="border-radius: 25px; margin-top: 10px; background-color: red; color: white;">
           <img src="assets/lectures/delete.png" alt="Delete" style="width: 25px; height: 25px;">
        </button>
        <button class="edit-btn btn section-text" type="button" onclick="redirectToEditQuiz('${quiz.id}')" style="border-radius: 25px; margin-top: 10px; background-color: #245D51; color: white;">
           <img src="assets/lectures/edit-button.png" alt="Edit"  style="width: 25px; height: 25px;">
        </button>
        ` : '';

        quizDiv.innerHTML = `
            <div class="quiz-item row">
                <div class="col-md-10 quiz-info">
                    <h2>${quiz.title}</h2>
                    <p>${quiz.description}</p>
                    <p>Total Questions: ${quiz.totalQuestions}</p>
                    <p>Duration: ${quiz.duration} min</p>
                </div>
                <div class="col-md-2 text-end">
                    <a href="quizDetails.html?quizId=${quiz.id}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Start</a>
                    <br>
                    ${buttons}
                </div>
            </div>
        `;
        quizList.appendChild(quizDiv);
    });
}

// Confirm before sending DELETE request
function confirmDeleteQuiz(quizId) {
    const isConfirmed = confirm("Are you sure you want to delete this quiz?");
    if (isConfirmed) {
        deleteQuiz(quizId);
    }
}

function redirectToEditQuiz(quizId) {
    window.location.href = `edit-quiz.html?quizId=${quizId}`;
}


async function deleteQuiz(quizId) {
    try {
        const response = await fetch(`/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            // Quiz deleted successfully, reload the quizzes
            fetchQuizzes();
        } else {
            console.error('Error deleting quiz:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
}

function redirectToQuizResults() {
    if (accessToken) {
        window.location.href = `view-grades.html`;
    } else {
        alert("User not logged in. Please log in to view your quiz results.");
    }
}

fetchQuizzes();
