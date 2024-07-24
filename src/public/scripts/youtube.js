document.getElementById('youtube-search').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) { // Trigger search only if query length is more than 2 characters
        fetchYouTubeVideos(query);
    }
});

async function fetchYouTubeVideos(query) {
    const apiKey = 'AIzaSyC25N6fhl09xxTV9eFCccl4x7ASOCsiaaw'; // Replace with your API key
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const resultsContainer = document.getElementById('videos');
        resultsContainer.innerHTML = ''; // Clear previous results

        if (data.items) {
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const thumbnail = item.snippet.thumbnails.default.url;
                const title = item.snippet.title;
                const videoElement = document.createElement('div');
                videoElement.classList.add('youtube-video');
                videoElement.innerHTML = `
                    <img src="${thumbnail}" alt="${title}" onclick="playVideo('${videoId}')">
                    <p>${title}</p>
                `;
                resultsContainer.appendChild(videoElement);
            });
        } else {
            resultsContainer.innerHTML = 'No results found';
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
    }
}

function playVideo(videoId) {
    const player = document.getElementById('youtube-player'); // Correct ID for video player
    player.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}