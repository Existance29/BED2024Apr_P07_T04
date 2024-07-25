// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchYouTubeVideos('course summary'); // Fetch YouTube videos with the query 'course summary' by default
});

// Variable to store the debounce timeout ID
let debounceTimeout;

// Event listener for input on the YouTube search field
document.getElementById('youtube-search').addEventListener('input', function() {
    clearTimeout(debounceTimeout); // Clear the previous debounce timeout
    const query = this.value; // Get the current value of the input field

    debounceTimeout = setTimeout(() => {
        if (query.length > 2) { // Check if the query length is greater than 2 characters
            fetchYouTubeVideos(query); // Fetch YouTube videos with the current query
        }
    }, 300); // Set the debounce delay to 300 milliseconds
});

// Function to fetch YouTube videos based on a query
async function fetchYouTubeVideos(query) {
    try {
        console.log('Fetching YouTube videos for query:', query); // Log the query for debugging
        const response = await fetch(`/courses/youtube-search/${encodeURIComponent(query)}`); // Send a GET request to the server to search YouTube videos
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not OK
        }
        const videos = await response.json(); // Parse the JSON response containing the video data

        const resultsContainer = document.getElementById('videos'); // Get the container to display the video results
        resultsContainer.innerHTML = ''; // Clear any previous results

        if (videos.length) { // Check if there are any videos in the response
            videos.forEach(video => {
                const videoElement = document.createElement('div'); // Create a new div element for each video
                videoElement.classList.add('youtube-video'); // Add a class for styling
                videoElement.innerHTML = `
                    <img src="${video.thumbnail}" alt="${video.title}" onclick="playVideo('${video.videoId}')"> <!-- Display the video thumbnail and add an onclick event to play the video -->
                    <p>${video.title}</p> <!-- Display the video title -->
                `;
                resultsContainer.appendChild(videoElement); // Append the video element to the results container
            });
        } else {
            resultsContainer.innerHTML = 'No results found'; // Display a message if no videos are found
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error); // Log any errors to the console
    }
}

// Function to play a selected YouTube video
function playVideo(videoId) {
    const player = document.getElementById('youtube-player'); // Get the player container
    player.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> <!-- Embed the YouTube video in an iframe and autoplay it -->
    `;
}
