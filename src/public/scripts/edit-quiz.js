document.addEventListener('DOMContentLoaded', async function() {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quizId');

    // Fetch existing quiz data
    try {
        const response = await fetch(`/quizzes/${quizId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quiz = await response.json();

        document.getElementById('title').value = quiz.title;
        document.getElementById('description').value = quiz.description;
        document.getElementById('totalQuestions').value = quiz.totalQuestions;
        document.getElementById('totalMarks').value = quiz.totalMarks; // This will be updated automatically
        document.getElementById('duration').value = quiz.duration;
        document.getElementById('maxAttempts').value = quiz.maxAttempts;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        alert('Error fetching quiz data. Please try again.');
    }

    document.getElementById('totalQuestions').addEventListener('input', function() {
        const totalQuestions = parseInt(this.value) || 0;
        document.getElementById('totalMarks').value = totalQuestions * 10;
    });

    document.getElementById('quizForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        const quizData = {
            title: formData.get('title'),
            description: formData.get('description'),
            totalQuestions: parseInt(formData.get('totalQuestions')),
            totalMarks: parseInt(formData.get('totalQuestions')) * 10, // Ensure totalMarks is always totalQuestions * 10
            duration: parseInt(formData.get('duration')),
            maxAttempts: parseInt(formData.get('maxAttempts'))
        };

        try {
            const response = await fetch(`/quizzes/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(quizData)
            });

            if (response.ok) {
                alert('Quiz updated successfully!');
                window.location.href = 'quiz.html';
            } else {
                console.error('Error updating quiz:', response.statusText);
                alert('Error updating quiz: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error updating quiz:', error);
            alert('Error updating quiz. Please try again.');
        }
    });

    document.getElementById('editQuestionsBtn').addEventListener('click', function() {
        window.location.href = `edit-questions.html?quizId=${quizId}`;
    });
});
