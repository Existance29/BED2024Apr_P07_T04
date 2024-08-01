async function fetchQuizResults() {
    try {
        const response = await fetch(`http://localhost:3000/random-quizzes/results`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}` // Include the JWT token
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Server response:', result); // Log the response
        displayResults(result);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
    }
}

function displayResults(result) {
    if (!result) {
        console.error('Invalid result data:', result);
        return;
    }

    const minutes = Math.floor(result.duration / 60);
    const seconds = result.duration % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <h2>Total Score: ${result.score}/${result.totalMarks}</h2>
        <p>Time Taken: ${timeFormatted}</p>
        <p>Grade: ${result.grade}</p>
        <h3>${result.incorrectQuestions?.length || 0} Question(s) Wrong</h3>
        ${result.incorrectQuestions?.map(question => `
            <div class="incorrect-question">
                <p><strong>Question ${question.questionId + 1}: ${question.text}</strong></p>
                <ul class="options">
                    ${question.options.map((option, index) => `
                        <li class="${index === question.correctAnswer ? 'correct' : index === question.userAnswer ? 'incorrect' : ''}">
                            ${String.fromCharCode(65 + index)}: ${option}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('')}
    `;
}


fetchQuizResults();
