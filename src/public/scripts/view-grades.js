//Check if user is logged in before loading content
//if user is not logged in, redirect them to login screen
//Dont wait for content to load, redirect asap


const userId = getUserID(); 

function getUserID(){
    if (sessionStorage.userid != null){
        return sessionStorage.userid;
    } else if (localStorage.userid != null){
        return localStorage.userid;
    } 
    return null;
}

async function fetchUserQuizResults() {
    try {
        const response = await fetch(`http://localhost:3000/user/${userId}/results`);
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
        resultsContainer.innerHTML = '<p>No quizzes taken yet.</p>';
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
