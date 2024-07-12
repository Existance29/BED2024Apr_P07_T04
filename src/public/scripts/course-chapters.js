guardLoginPage();
const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
const role = sessionStorage.getItem("role") || localStorage.getItem("role");
let editMode = false; // Initialize editMode to false

console.log('Access Token:', token); // Debugging log
console.log('Role:', role); // Debugging log

// Function to toggle edit mode 
function toggleEditMode() {
    editMode = !editMode;
    loadCourseDetails();
}

// Fetch course details including lectures
async function fetchCourseDetailsWithLectures(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}/lectures/without-video`);
        if (!response.ok) throw new Error('Failed to fetch course details with lectures');
        const courseWithLectures = await response.json();
        console.log('Course with Lectures:', courseWithLectures);  // Log for debugging
        return courseWithLectures[0]; // Access the first course in the array
    } catch (error) {
        console.error('Error fetching course details with lectures:', error);
        return null;
    }
}

// Fetch basic course details without lectures
async function fetchBasicCourseDetails(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch basic course details');
        const course = await response.json();
        console.log('Basic Course Details:', course);  // Log for debugging
        return course;
    } catch (error) {
        console.error('Error fetching basic course details:', error);
        return null;
    }
}

// Load course details and lectures
async function loadCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const courseID = params.get('courseID');
    
    if (!courseID) {
        console.error('No course ID found in URL');
        return;
    }

    console.log('Course ID:', courseID);  // Log the course ID

    // Fetch course details including lectures
    const courseWithLectures = await fetchCourseDetailsWithLectures(courseID);
    if (!courseWithLectures || !Array.isArray(courseWithLectures.lectures) || courseWithLectures.lectures.length === 0) {
        console.error('No lecture in the course, fetching basic course details');
        const basicCourseDetails = await fetchBasicCourseDetails(courseID);
        if (!basicCourseDetails) {
            console.error('Failed to load basic course details');
            return;
        }

        updateCourseDetails(basicCourseDetails);
        document.getElementById('chapter-grid').innerHTML = '<p>No lectures found for this course.</p>';
        return;
    }

    console.log('Loaded course with lectures:', courseWithLectures);

    updateCourseDetails(courseWithLectures);

    const lectures = courseWithLectures.lectures;

    // Display lectures and their sub-lectures
    const chapterGrid = document.getElementById('chapter-grid');
    chapterGrid.innerHTML = '';  // Clear existing content

    lectures.forEach((lecture, index) => {
        console.log('Lecture:', lecture);  // Log each lecture for debugging

        let subLectureHTML = '';
        if (lecture.subLectures && lecture.subLectures.length > 0) {
            subLectureHTML = lecture.subLectures.map((subLecture, subIndex) => `
                <div class="subchapter-container" style="margin-top: 1vw;">
                    <div class="subchapter">
                        <div style="width: 70%;" onclick="openLecture('${courseID}', '${lecture.lectureID}', '${subLecture.subLectureID}')">
                            <div style="font-size: 0.9vw; color: #333333; font-weight: 500;">${subLecture.description}</div>
                            <div style="font-size: 0.85vw; color: #59595A; font-weight: 400; margin-top: 0.2vw;">Lesson ${subIndex + 1}</div>
                        </div>
                        <div class="d-flex align-items-center time-container">
                            <img src="./assets/lectures/time-icon-2.png" style="height: 0.85vw; margin-right: 0.3vw;">
                            ${subLecture.duration} Minutes
                        </div>
                        ${(editMode && role === 'lecturer') ? `
                            <div class="edit-delete-buttons" style="margin-left: 1vw;">
                                <button class="edit-btn" onclick="editSubLecture('${subLecture.subLectureID}')">
                                    <img src="assets/lectures/edit-button-black.png" alt="Edit" style="width: 20px; height: 20px;">
                                </button>
                                <button class="delete-btn" onclick="deleteSubLecture('${lecture.lectureID}', '${subLecture.subLectureID}')">
                                    <img src="assets/lectures/delete-black.png" alt="Delete" style="width: 20px; height: 20px;">
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        const lectureHTML = `
            <div class="chapter">
                ${(editMode && role === 'lecturer') ? `
                    <div class="edit-delete-buttons">
                        <button class="edit-btn" onclick="editLecture('${lecture.lectureID}')"><img src="assets/lectures/edit-button-black.png" alt="Edit" style="width: 20px; height: 20px;"></button>
                        <button class="delete-btn" onclick="deleteLecture('${lecture.lectureID}')"><img src="assets/lectures/delete-black.png" alt="Delete" style="width: 20px; height: 20px;"></button>
                    </div>
                ` : ''}
                <h2>${String(index + 1).padStart(2, '0')}</h2>
                <div style="font-weight: 600; font-size: 1vw; margin-bottom: 1.5vw;">${lecture.description}</div>
                ${subLectureHTML}
                
            </div>`;
        chapterGrid.innerHTML += lectureHTML;
    });
}

// Update course details (title, description, video)
function updateCourseDetails(course) {
    document.getElementById('title').innerText = course.title;
    document.getElementById('header-desc').innerText = course.description;
    if (course.video && course.video.data) {
        const videoSrc = `data:video/mp4;base64,${arrayBufferToBase64(course.video.data)}`;
        document.getElementById('course-video').src = videoSrc;
    }
}

// Redirect to lecture page
function openLecture(courseID, lectureID, subLectureID) {
    window.location.href = `lecture.html?courseID=${courseID}&lectureID=${lectureID}&subLectureID=${subLectureID}`;
}

// Convert binary data to base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function redirectToUploadLecture() {
    const params = new URLSearchParams(window.location.search);
    const courseID = params.get('courseID');
    window.location.href = `upload-lecture.html?courseID=${courseID}`;
}

// Function to edit lecture
function editLecture(lectureID) {
    console.log('Edit Lecture:', lectureID);  // Log for debugging
    // Implement the edit functionality here
}

// Function to delete lecture
async function deleteLecture(lectureID) {
    console.log('Delete Lecture:', lectureID);  // Log for debugging
    const isConfirmed = confirm("Are you sure you want to delete this lecture?");
    if (isConfirmed) {
        try {
            const response = await fetch(`/lectures/${lectureID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log('Lecture deleted successfully');
                loadCourseDetails();  // Reload the course details
            } else {
                console.error('Error deleting lecture:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting lecture:', error);
        }
    }
}

// Function to delete sub-lecture
async function deleteSubLecture(lectureID, subLectureID) {
    console.log('Delete Sub-Lecture:', subLectureID);  // Log for debugging
    const isConfirmed = confirm("Are you sure you want to delete this sub-lecture?");
    if (isConfirmed) {
        try {
            const response = await fetch(`/lectures/${lectureID}/sublectures/${subLectureID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log('Sub-lecture deleted successfully');
                loadCourseDetails();  // Reload the course details
            } else {
                console.error('Error deleting sub-lecture:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting sub-lecture:', error);
        }
    }
}

// Function to hide buttons if the user is not a lecturer
function hideButtonsIfNotLecturer() {
    const uploadButtonContainer = document.getElementById('upload-button');
    const editButton = document.querySelector('img[onclick="toggleEditMode()"]');

    if (role !== 'lecturer') {
        if (uploadButtonContainer) uploadButtonContainer.style.display = 'none';
        if (editButton) editButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    hideButtonsIfNotLecturer();
    loadCourseDetails();
});
