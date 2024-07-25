document.addEventListener('DOMContentLoaded', function() {
    fetchYouTubeVideos('course summary');
});

let debounceTimeout;

document.getElementById('youtube-search').addEventListener('input', function() {
    clearTimeout(debounceTimeout);
    const query = this.value;

    debounceTimeout = setTimeout(() => {
        if (query.length > 2) {
            fetchYouTubeVideos(query);
        }
    }, 300);
});

async function fetchYouTubeVideos(query) {
    try {
        console.log('Fetching YouTube videos for query:', query);
        const response = await fetch(`/courses/youtube-search/${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos = await response.json();


        const resultsContainer = document.getElementById('videos');
        resultsContainer.innerHTML = '';

        if (videos.length) {
            videos.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('youtube-video');
                videoElement.innerHTML = `
                    <img src="${video.thumbnail}" alt="${video.title}" onclick="playVideo('${video.videoId}')">
                    <p>${video.title}</p>
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
    const player = document.getElementById('youtube-player');
    player.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}
