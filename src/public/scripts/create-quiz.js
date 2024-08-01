document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

    document.getElementById('quizForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        const quizData = {
            title: formData.get('title'),
            description: formData.get('description'),
            totalQuestions: parseInt(formData.get('totalQuestions')),
            totalMarks: parseInt(formData.get('totalQuestions')) * 10,
            duration: parseInt(formData.get('duration')),
            maxAttempts: parseInt(formData.get('maxAttempts'))
        };

        try {
            const response = await fetch('/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(quizData)
            });

            if (response.ok) {
                const result = await response.json();
                window.location.href = `create-questions.html?quizId=${result.id}&totalQuestions=${quizData.totalQuestions}`;
            } else {
                console.error('Error creating quiz:', response.statusText);
                alert('Error creating quiz: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz. Please try again.');
        }
    });
});
