document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quizId');
    const totalQuestions = parseInt(params.get('totalQuestions'));

    const questionsContainer = document.getElementById('questionsContainer');

    for (let i = 1; i <= totalQuestions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mb-3';
        questionDiv.innerHTML = `
            <div>
                <label class="label" style="font-size: 20px;">Question ${i}</label>
                <input type="text" class="input form-control" id="question${i}" placeholder="Enter your question..." required />
            </div>
            <br>
            <div>
                <label class="label">Correct Answer</label>
                <div class="dropdown">
                    <select class="dropdown-select form-select" id="correctAnswer${i}" required>
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                    </select>
                </div>
            </div>
            <br>
            <div class="card mt-3">
                <div class="card-header">Option A</div>
                <input type="text" class="input form-control" id="optionA${i}" placeholder="Enter option A..." required />
            </div>

            <div class="card mt-3">
                <div class="card-header">Option B</div>
                <input type="text" class="input form-control" id="optionB${i}" placeholder="Enter option B..." required />
            </div>

            <div class="card mt-3">
                <div class="card-header">Option C</div>
                <input type="text" class="input form-control" id="optionC${i}" placeholder="Enter option C..." required />
            </div>

            <div class="card mt-3">
                <div class="card-header">Option D</div>
                <input type="text" class="input form-control" id="optionD${i}" placeholder="Enter option D..." required />
            </div>
            <br>
        `;
        questionsContainer.appendChild(questionDiv);
    }

    document.getElementById('questionsForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        const questions = [];
        for (let i = 1; i <= totalQuestions; i++) {
            questions.push({
                text: document.getElementById(`question${i}`).value,
                options: [
                    document.getElementById(`optionA${i}`).value,
                    document.getElementById(`optionB${i}`).value,
                    document.getElementById(`optionC${i}`).value,
                    document.getElementById(`optionD${i}`).value
                ],
                correctAnswer: parseInt(document.getElementById(`correctAnswer${i}`).value)
            });
        }

        try {
            const response = await fetch(`/quizzes/${quizId}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questions })
            });

            if (response.ok) {
                alert('Questions created successfully!');
                window.location.href = 'quiz.html';
            } else {
                console.error('Error creating questions:', response.statusText);
                alert('Error creating questions: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error creating questions:', error);
            alert('Error creating questions. Please try again.');
        }
    });
});
