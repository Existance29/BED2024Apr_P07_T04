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
    if (!courseWithLectures) {
        console.error('Failed to load course details with lectures');
        return;
    }

    console.log('Loaded course with lectures:', courseWithLectures);

    const course = courseWithLectures;  // Use the first object in the array
    const lectures = course.lectures;

    // Update course title, description, and video
    document.getElementById('title').innerText = course.title;
    document.getElementById('header-desc').innerText = course.description;
    if (course.video && course.video.data) {
        const videoSrc = `data:video/mp4;base64,${arrayBufferToBase64(course.video.data)}`;
        document.getElementById('course-video').src = videoSrc;
    }

    // Ensure lectures is an array and has length
    if (!Array.isArray(lectures) || lectures.length === 0) {
        document.getElementById('chapter-grid').innerHTML = '<p>No lectures found for this course.</p>';
        return;
    }

    // Display lectures and their sub-lectures
    const chapterGrid = document.getElementById('chapter-grid');
    chapterGrid.innerHTML = '';  // Clear existing content

    lectures.forEach((lecture, index) => {
        console.log('Lecture:', lecture);  // Log each lecture for debugging

        let subLectureHTML = '';
        if (lecture.subLectures && lecture.subLectures.length > 0) {
            subLectureHTML = lecture.subLectures.map((subLecture, subIndex) => `
                <div class="subchapter-container" style=" margin-top: 1vw;">
                    <div class="subchapter" onclick="openLecture('${course.courseID}', '${lecture.lectureID}', '${subLecture.subLectureID}')">
                        <div style="width: 70%;">
                            <div style="font-size: 0.9vw; color: #333333; font-weight: 500;">${subLecture.description}</div>
                            <div style="font-size: 0.85vw; color: #59595A; font-weight: 400; margin-top: 0.2vw;">${subLecture.category}</div>
                        </div>
                        <div class="d-flex align-items-center time-container">
                            <img src="./assets/lectures/time-icon-2.png" style="height: 0.85vw; margin-right: 0.3vw;">
                            ${subLecture.duration} Minutes
                        </div>
                    </div>
                </div>
            `).join('');
        }

        const lectureHTML = `
            <div style="background: #FFFFFF; padding: 1vw 7% 2vw; border-radius: 12px; margin-bottom: 2vw;">
                <h2>${String(index + 1).padStart(2, '0')}</h2>
                <div style="font-weight: 600; font-size: 1vw; margin-bottom: 1.5vw;">${lecture.description}</div>
                ${subLectureHTML}
            </div>`;
        chapterGrid.innerHTML += lectureHTML;
    });
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

document.addEventListener('DOMContentLoaded', loadCourseDetails);
