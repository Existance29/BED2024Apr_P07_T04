document.addEventListener('DOMContentLoaded', async function() {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quizId');
    const questionsContainer = document.getElementById('questionsContainer');

    try {
        const response = await fetch(`/quizzes/${quizId}/questions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }

        const questions = await response.json();
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'mb-3';
            questionDiv.innerHTML = `
                <div>
                    <label class="label" style="font-size: 20px;">Question ${index + 1}</label>
                    <input type="text" class="input form-control" id="question${index + 1}" name="question" value="${question.text}" required />
                </div>
                <br>
                <div>
                    <label class="label">Correct Answer</label>
                    <div class="dropdown">
                        <select class="dropdown-select form-select" id="correctAnswer${index + 1}" name="correctAnswer" required>
                            <option value="0" ${question.correctAnswer === 0 ? 'selected' : ''}>Option A</option>
                            <option value="1" ${question.correctAnswer === 1 ? 'selected' : ''}>Option B</option>
                            <option value="2" ${question.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
                            <option value="3" ${question.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
                        </select>
                    </div>
                </div>
                <br>
                <div class="card mt-3">
                    <div class="card-header">Option A</div>
                    <input type="text" class="input form-control" id="optionA${index + 1}" name="optionA" value="${question.options[0]}" required />
                </div>

                <div class="card mt-3">
                    <div class="card-header">Option B</div>
                    <input type="text" class="input form-control" id="optionB${index + 1}" name="optionB" value="${question.options[1]}" required />
                </div>

                <div class="card mt-3">
                    <div class="card-header">Option C</div>
                    <input type="text" class="input form-control" id="optionC${index + 1}" name="optionC" value="${question.options[2]}" required />
                </div>

                <div class="card mt-3">
                    <div class="card-header">Option D</div>
                    <input type="text" class="input form-control" id="optionD${index + 1}" name="optionD" value="${question.options[3]}" required />
                </div>
                <br>
            `;
            questionsContainer.appendChild(questionDiv);
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Error fetching questions. Please try again.');
    }

    document.getElementById('questionsForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const questions = [];
        for (let i = 1; i <= document.getElementsByName('question').length; i++) {
            const questionText = document.getElementById(`question${i}`).value;
            const correctAnswer = parseInt(document.getElementById(`correctAnswer${i}`).value);
            const optionA = document.getElementById(`optionA${i}`).value;
            const optionB = document.getElementById(`optionB${i}`).value;
            const optionC = document.getElementById(`optionC${i}`).value;
            const optionD = document.getElementById(`optionD${i}`).value;

            questions.push({
                text: questionText,
                options: [optionA, optionB, optionC, optionD],
                correctAnswer: correctAnswer
            });
        }

        console.log('Questions payload:', questions); // Log the payload

        try {
            const response = await fetch(`/quizzes/${quizId}/questions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questions })
            });

            if (response.ok) {
                alert('Questions updated successfully!');
                window.location.href = 'quiz.html';
            } else {
                console.error('Error updating questions:', response.statusText);
                alert('Error updating questions: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error updating questions:', error);
            alert('Error updating questions. Please try again.');
        }
    });
});
