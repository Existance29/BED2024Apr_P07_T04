// Check if user is logged in before loading content
// If user is not logged in, redirect them to login screen
// Don't wait for content to load, redirect asap
guardLoginPage();

async function fetchUserQuizResults() {
    try {
        const response = await get('http://localhost:3000/user/results');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const results = await response.json();
        displayUserQuizResults(results);
    } catch (error) {
        console.error('Error fetching user quiz results:', error);
    }
}

function displayUserQuizResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="d-flex" style="margin-left: 17%; color: white; width: 65%; height: 2vw;"><p class="exo-semibold" style="font-size: 1.8vw; margin-right: 45%;">No quizzes taken yet.</p><div>';
        return;
    }

    resultsContainer.innerHTML = results.map(result => `
        <div class="quiz-result row">
            <div class="col-md-10">
                <h3>${result.title}</h3>
                <p>Score: ${result.score}/${result.totalMarks}</p>
                <p>Grade: ${result.grade}</p>
                <p>Time Taken: ${formatTime(result.timeTaken)}</p>
            </div>
            <div class="col-md-2 text-end">
                <a href="quizResults.html?quizId=${result.quizId}&resultId=${result.id}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Details</a>
            </div>
        </div>
    `).join('');
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

fetchUserQuizResults();
