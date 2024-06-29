
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizId');
let questions = [];

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
            body: JSON.stringify({ quizId, answers })
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