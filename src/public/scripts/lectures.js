// Check if the user is logged in before loading content
// If the user is not logged in, redirect them to the login screen
guardLoginPage();

const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"); // Get the access token from session or local storage
const role = sessionStorage.getItem("role") || localStorage.getItem("role"); // Get the user role from session or local storage

console.log('Role:', role); // Debugging log to check the user role

// Change the font color of the sublecture description to gray
function viewSubLecture(id) {
    document.getElementById(`desc-${id}`).style.color = "#7F7F7F";
}

// Fetch course details including lectures
async function fetchCourseDetailsWithLectures(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}/lectures`); // Fetch course details with lectures from the server
        if (!response.ok) throw new Error('Failed to fetch course details with lectures');
        const courseWithLectures = await response.json(); // Parse the response JSON
        console.log('Course with Lectures:', courseWithLectures);  // Log for debugging
        return courseWithLectures[0]; // Access the first course in the array
    } catch (error) {
        console.error('Error fetching course details with lectures:', error);
        return null;
    }
}

// Fetch lecture or sub-lecture details
async function fetchLectureDetails(lectureID, subLectureID = null) {
    try {
        let url = `/lectures/${lectureID}`; // Base URL for fetching lecture details
        if (subLectureID) {
            url += `/sublectures/${subLectureID}`; // Append sub-lecture ID to URL if provided
        }
        const response = await fetch(url); // Fetch lecture or sub-lecture details from the server
        if (!response.ok) throw new Error('Failed to fetch lecture details');
        const lecture = await response.json(); // Parse the response JSON
        console.log('Lecture:', lecture);  // Log for debugging
        return lecture;
    } catch (error) {
        console.error('Error fetching lecture details:', error);
        return null;
    }
}

// Normalize the video property name
function normalizeVideoProperty(lecture) {
    if (lecture.video && lecture.video.data) {
        return lecture.video.data; // Return video data if property name is 'video'
    }
    if (lecture.Video && lecture.Video.data) {
        return lecture.Video.data; // Return video data if property name is 'Video'
    }
    return null;
}

// Load course and lecture details
async function loadCourseAndLectureDetails() {
    const params = new URLSearchParams(window.location.search); // Parse URL parameters
    const courseID = params.get('courseID'); // Get course ID from URL
    const lectureID = params.get('lectureID'); // Get lecture ID from URL
    const subLectureID = params.get('subLectureID'); // Get sub-lecture ID from URL

    if (!courseID || !lectureID) {
        console.error('No course ID or lecture ID found in URL');
        return;
    }

    // Fetch course and lecture details
    const course = await fetchCourseDetailsWithLectures(courseID);

    if (!course) {
        console.error('Failed to load course details');
        return;
    }

    // Debugging information
    console.log('Course:', course);

    // Update course details
    document.getElementById('course-title').innerText = course.title;

    // Populate course details text
    const courseDetailsText = document.getElementById('course-details-text');
    courseDetailsText.innerText = course.details;

    // Check if course.lectures is an array
    if (Array.isArray(course.lectures)) {
        // Sort lectures by lectureID
        course.lectures.sort((a, b) => a.lectureID - b.lectureID);

        // Update lectures list
        const lecturesList = document.getElementById('lectures-list');
        lecturesList.innerHTML = ''; // Clear existing content

        course.lectures.forEach((lec, index) => {
            let subLectureHTML = '';
            if (lec.subLectures && lec.subLectures.length > 0) {
                // Sort subLectures by subLectureID
                lec.subLectures.sort((a, b) => a.subLectureID - b.subLectureID);
                subLectureHTML = lec.subLectures.map((subLecture) => `
                    <div class="subchapter-container" style="margin-top: 1vw;">
                        <div class="subchapter ${subLecture.subLectureID === subLectureID ? 'active-sub' : ''}" data-sub-lecture-id="${subLecture.subLectureID}" data-lecture-id="${lec.lectureID}">
                            <div style="width: 70%;">
                                <div style="font-size: 0.9vw; color: #333333; font-weight: 500;" id="desc-${subLecture.subLectureID}">${subLecture.name}</div>
                            </div>
                            <div class="d-flex align-items-center time-container">
                                <img src="./assets/lectures/time-icon-2.png" style="height: 0.85vw; margin-right: 0.3vw;">
                                ${subLecture.duration} Minutes
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            let lectureHTML = `
                <div class="lecture-item ${lectureID == lec.lectureID ? 'active' : ''}" data-lecture-id="${lec.lectureID}" style="background: #FFFFFF; padding: 1vw 7% 2vw; border-radius: 12px; margin-bottom: 1vw;">
                    <h2>${String(index + 1).padStart(2, '0')}</h2>
                    <div style="font-weight: 600; font-size: 1vw; margin-bottom: 1.5vw;">${lec.description}</div>
                    ${subLectureHTML}
                </div>`;
            
            lecturesList.innerHTML += lectureHTML; // Add lecture HTML to the lectures list
        });
    } else {
        console.error('Lectures data is not an array:', course.lectures);
        document.getElementById('course-details-text').innerText = 'No course details available';
    }

    // Indicate the sublectures that have been viewed
    const viewedSubLectures = await (await get(`/users/courses/sublectures/${courseID}`)).json();
    viewedSubLectures.forEach((x) => viewSubLecture(x));

    // Finished loading, show the content
    loadContent();

    // Load the initial video
    if (subLectureID) {
        loadSubLectureVideo(subLectureID, lectureID, courseID);
    } else {
        loadLectureVideo(lectureID, courseID);
    }
}

// Function to load lecture video
async function loadLectureVideo(lectureID, courseID) {
    const lecture = await fetchLectureDetails(lectureID); // Fetch lecture details
    const videoData = normalizeVideoProperty(lecture); // Normalize video property name

    // Highlight the selected lecture
    const lectureItems = document.querySelectorAll('.lecture-item');
    lectureItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`.lecture-item[data-lecture-id="${lectureID}"]`).classList.add('active');

    // Clear sub-lecture highlight
    const subLectureItems = document.querySelectorAll('.subchapter');
    subLectureItems.forEach(item => item.classList.remove('active-sub'));

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lectureID', lectureID);
    url.searchParams.delete('subLectureID');
    window.history.pushState({}, '', url);
}

// Function to load sub-lecture video
async function loadSubLectureVideo(subLectureID, lectureID, courseID) {
    const viewSubLectureResponse = await post(`./users/sublecture/${subLectureID}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }); // Add the viewed sublecture to the database

    const subLecture = await fetchLectureDetails(lectureID, subLectureID); // Fetch sub-lecture details
    const videoData = normalizeVideoProperty(subLecture); // Normalize video property name

    if (!subLecture || !videoData) {
        console.error('Failed to load sub-lecture video');
        return;
    }

    const videoSrc = `data:video/mp4;base64,${arrayBufferToBase64(videoData)}`; // Convert video data to base64 string
    const lectureVideoElement = document.getElementById('lecture-video');
    lectureVideoElement.src = videoSrc;
    lectureVideoElement.load();

    // If updating the user's viewed sublecture database was successful, show view indicator
    if (viewSubLectureResponse.status == 201) { 
        viewSubLecture(subLectureID);
    }

    // Highlight the selected sub-lecture
    const subLectureItems = document.querySelectorAll('.subchapter');
    subLectureItems.forEach(item => item.classList.remove('active-sub'));
    document.querySelector(`.subchapter[data-sub-lecture-id="${subLectureID}"]`).classList.add('active-sub');

    // Highlight the parent lecture
    const lectureItems = document.querySelectorAll('.lecture-item');
    lectureItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`.lecture-item[data-lecture-id="${lectureID}"]`).classList.add('active');

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lectureID', lectureID);
    url.searchParams.set('subLectureID', subLectureID);
    window.history.pushState({}, '', url);
}

// Convert binary data to base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Convert binary data to base64 string
}

document.addEventListener('DOMContentLoaded', loadCourseAndLectureDetails); // Load course and lecture details when the document is ready

// Event delegation for lecture items
document.getElementById('lectures-list').addEventListener('click', async (event) => {
    const lectureItem = event.target.closest('.lecture-item');
    const subLectureItem = event.target.closest('.subchapter');
    
    if (subLectureItem) {
        const subLectureID = subLectureItem.getAttribute('data-sub-lecture-id');
        const lectureID = subLectureItem.getAttribute('data-lecture-id');
        const courseID = new URLSearchParams(window.location.search).get('courseID');
        loadSubLectureVideo(subLectureID, lectureID, courseID);
    } else if (lectureItem) {
        const lectureID = lectureItem.getAttribute('data-lecture-id');
        const courseID = new URLSearchParams(window.location.search).get('courseID');
        loadLectureVideo(lectureID, courseID);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const courseID = params.get('courseID');
    if (courseID) {
        const backButton = document.querySelector('.btn.section-text');
        backButton.href = `./course-chapters.html?courseID=${courseID}`;
    }
});