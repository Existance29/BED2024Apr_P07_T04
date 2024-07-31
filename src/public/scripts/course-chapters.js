guardLoginPage(); // Ensure the user is logged in before accessing the page
const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"); // Retrieve the access token
const role = sessionStorage.getItem("role") || localStorage.getItem("role"); // Retrieve the user role
let editMode = false; // Initialize editMode to false
let currentLectureID = null; // Store the current lecture ID for editing
let currentSubLectureID = null; // Store the current sub-lecture ID for editing

console.log('Role:', role); // Debugging log to check the user role

// Function to toggle edit mode 
function toggleEditMode() {
    editMode = !editMode; // Toggle edit mode
    loadCourseDetails(); // Reload course details
}

// Fetch course details including lectures
async function fetchCourseDetailsWithLectures(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}/lectures/without-video`); // Fetch course details with lectures
        if (!response.ok) throw new Error('Failed to fetch course details with lectures');
        const courseWithLectures = await response.json(); // Parse the response JSON
        console.log('Course with Lectures:', courseWithLectures);  // Log for debugging
        return courseWithLectures[0]; // Access the first course in the array
    } catch (error) {
        console.error('Error fetching course details with lectures:', error); // Log error
        return null;
    }
}

// Fetch basic course details without lectures
async function fetchBasicCourseDetails(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include the access token in the request
            }
        });
        if (!response.ok) throw new Error('Failed to fetch basic course details');
        const course = await response.json(); // Parse the response JSON
        console.log('Basic Course Details:', course);  // Log for debugging
        return course;
    } catch (error) {
        console.error('Error fetching basic course details:', error); // Log error
        return null;
    }
}

// Load course details and lectures
async function loadCourseDetails() {
    const params = new URLSearchParams(window.location.search); // Get URL parameters
    const courseID = params.get('courseID'); // Get the course ID from URL

    if (!courseID) {
        console.error('No course ID found in URL');
        return;
    }

    console.log('Course ID:', courseID);  // Log the course ID

    const courseWithLectures = await fetchCourseDetailsWithLectures(courseID); // Fetch course details including lectures
    if (!courseWithLectures || !Array.isArray(courseWithLectures.lectures) || courseWithLectures.lectures.length === 0) {
        console.error('No lecture in the course, fetching basic course details');
        const basicCourseDetails = await fetchBasicCourseDetails(courseID); // Fetch basic course details if no lectures found
        if (!basicCourseDetails) {
            console.error('Failed to load basic course details');
            return;
        }

        updateCourseDetails(basicCourseDetails); // Update course details on the page
        document.getElementById('chapter-grid').innerHTML = '<p>No lectures found for this course.</p>'; // Display message if no lectures
        fetchYouTubeVideos(basicCourseDetails.title); // Automatically search for YouTube videos based on the course title
        return;
    }

    console.log('Loaded course with lectures:', courseWithLectures);

    updateCourseDetails(courseWithLectures); // Update course details on the page
    fetchYouTubeVideos(courseWithLectures.title); // Automatically search for YouTube videos based on the course title

    const lectures = courseWithLectures.lectures.sort((a, b) => a.lectureID - b.lectureID); // Sort lectures by LectureID

    lectures.forEach(lecture => {
        if (lecture.subLectures && lecture.subLectures.length > 0) {
            lecture.subLectures.sort((a, b) => a.subLectureID - b.subLectureID); // Sort sub-lectures by SubLectureID
        }
    });

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
                            <div style="font-size: 0.9vw; color: #333333; font-weight: 500;">${subLecture.name}</div>
                            <div style="font-size: 0.85vw; color: #59595A; font-weight: 400; margin-top: 0.2vw;">Lesson ${subIndex + 1}</div>
                        </div>
                        <div class="d-flex align-items-center time-container">
                            <img src="./assets/lectures/time-icon-2.png" style="height: 0.85vw; margin-right: 0.3vw;">
                            ${subLecture.duration} Minutes
                        </div>
                        ${(editMode && role === 'lecturer') ? `
                            <div class="edit-delete-buttons" style="margin-left: 1vw;">
                                <button class="edit-btn" onclick="openEditSubLectureModal('${lecture.lectureID}', '${subLecture.subLectureID}')">
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
                        <button class="edit-btn" onclick="openEditLectureModal('${lecture.lectureID}')"><img src="assets/lectures/edit-button-black.png" alt="Edit" style="width: 20px; height: 20px;"></button>
                        <button class="delete-btn" onclick="deleteLecture('${lecture.lectureID}')"><img src="assets/lectures/delete-black.png" alt="Delete" style="width: 20px; height: 20px;"></button>
                    </div>
                ` : ''}
                <h2>${String(index + 1).padStart(2, '0')}</h2>
                <div style="font-weight: 600; font-size: 1vw; margin-bottom: 1.5vw;">${lecture.name}</div>
                ${subLectureHTML}
                
            </div>`;
        chapterGrid.innerHTML += lectureHTML; // Add lecture HTML to the grid
    });
}

// Update course details (title, description, video)
function updateCourseDetails(course) {
    document.getElementById('title').innerText = course.title; // Update course title
    document.getElementById('header-desc').innerText = course.description; // Update course description
    if (course.video && course.video.data) {
        const videoSrc = `data:video/mp4;base64,${arrayBufferToBase64(course.video.data)}`; // Convert video to base64
        document.getElementById('course-video').src = videoSrc; // Set video source
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
    const params = new URLSearchParams(window.location.search); // Get URL parameters
    const courseID = params.get('courseID'); // Get the course ID from URL
    window.location.href = `upload-lecture.html?courseID=${courseID}`; // Redirect to upload lecture page
}

// Open edit lecture modal and populate the form with lecture details
async function openEditLectureModal(lectureID) {
    const lecture = await fetchLectureById(lectureID); // Fetch lecture details by ID
    currentLectureID = lectureID; // Set current lecture ID
    document.getElementById('editLectureName').value = lecture.name; // Populate form with lecture details
    document.getElementById('editLectureDescription').value = lecture.description;
    document.getElementById('editLectureCategory').value = lecture.category;
    document.getElementById('editLectureDuration').value = lecture.duration;
    $('#editLectureModal').modal('show'); // Show the modal
}

// Open edit sub-lecture modal and populate the form with sub-lecture details
async function openEditSubLectureModal(lectureID, subLectureID) {
    console.log('Editing Sub-Lecture:', { lectureID, subLectureID });  // Log for debugging
    const subLecture = await fetchSubLectureById(lectureID, subLectureID); // Fetch sub-lecture details by ID
    console.log('Fetched Sub-Lecture:', subLecture);  // Log for debugging

    currentLectureID = lectureID; // Set current lecture ID
    currentSubLectureID = subLectureID; // Set current sub-lecture ID

    if (subLecture) {
        document.getElementById('editSubLectureName').value = subLecture.Name; // Populate form with sub-lecture details
        document.getElementById('editSubLectureDescription').value = subLecture.Description;
        document.getElementById('editSubLectureDuration').value = subLecture.Duration;

        $('#editSubLectureModal').modal('show'); // Show the modal
    } else {
        console.error('Sub-Lecture not found');
    }
}

// Fetch lecture details by ID
async function fetchLectureById(lectureID) {
    try {
        const response = await fetch(`/lectures/${lectureID}`); // Fetch lecture details
        const lecture = await response.json(); // Parse response JSON
        return lecture;
    } catch (error) {
        console.error('Error fetching lecture details:', error); // Log error
        return null;
    }
}

/// Fetch sub-lecture details by ID
async function fetchSubLectureById(lectureID, subLectureID) {
    try {
        console.log('Fetching Sub-Lecture:', { lectureID, subLectureID });  // Log IDs for debugging
        const response = await fetch(`/lectures/${lectureID}/sublectures/${subLectureID}`); // Fetch sub-lecture details
        const subLecture = await response.json(); // Parse response JSON
        console.log('Fetched Sub-Lecture Data:', subLecture);  // Log the fetched data
        return subLecture;
    } catch (error) {
        console.error('Error fetching sub-lecture details:', error); // Log error
        return null;
    }
}

// Close edit lecture modal
function closeEditLectureModal() {
    $('#editLectureModal').modal('hide'); // Hide the modal
}

// Close edit sub-lecture modal
function closeEditSubLectureModal() {
    $('#editSubLectureModal').modal('hide'); // Hide the modal
}

// Update lecture details
async function editLecture() {
    const name = document.getElementById('editLectureName').value; // Get form values
    const description = document.getElementById('editLectureDescription').value;
    const category = document.getElementById('editLectureCategory').value;
    const duration = document.getElementById('editLectureDuration').value;

    const updatedLectureData = {
        name,
        description,
        category,
        duration
    };

    try {
        const response = await fetch(`/lectures/${currentLectureID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedLectureData) // Convert data to JSON
        });

        if (response.ok) {
            console.log('Lecture updated successfully');
            $('#editLectureModal').modal('hide'); // Hide the modal
            loadCourseDetails(); // Reload course details
        } else {
            const errorData = await response.json(); // Parse the error response
            console.error('Error response from server:', errorData); // Log the error
            if (errorData.message.includes("Lecture name already exists")) {
                alert("Lecture name already exists. Please choose a different name.");
            } else {
                alert(`Error uploading lecture: ${errorData.message}`);  // Display an alert with the error message
            }
            return;
        }
    } catch (error) {
        console.error('Error updating lecture:', error);
    }
}

/// Update sub-lecture details
async function editSubLecture() {
    const name = document.getElementById('editSubLectureName').value; // Get form values
    const description = document.getElementById('editSubLectureDescription').value;
    const duration = document.getElementById('editSubLectureDuration').value;

    const updatedSubLectureData = {
        name,
        description,
        duration
    };

    try {
        const response = await fetch(`/lectures/${currentLectureID}/sublectures/${currentSubLectureID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedSubLectureData) // Convert data to JSON
        });

        if (response.ok) {
            console.log('Sub-lecture updated successfully');
            $('#editSubLectureModal').modal('hide'); // Hide the modal
            loadCourseDetails(); // Reload course details
        } else {
            const errorData = await response.json(); // Parse the error response
                console.error('Error response from server:', errorData); // Log the error
                if (errorData.message.includes("Sub-lecture name already exists")) {
                    alert("Sub-lecture name already exists for this lecture. Please choose a different name.");
                } else {
                    alert(`Error uploading sub-lecture: ${errorData.message}`); // Display an alert with the error message
                }
                return;
        }
    } catch (error) {
        console.error('Error updating sub-lecture:', error);
    }
}

// Function to delete lecture
async function deleteLecture(lectureID) {
    console.log('Delete Lecture:', lectureID);  // Log for debugging
    const isConfirmed = confirm("Are you sure you want to delete this lecture?"); // Confirm deletion
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
    const isConfirmed = confirm("Are you sure you want to delete this sub-lecture?"); // Confirm deletion
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
    const uploadButtonContainer = document.getElementById('upload-button'); // Get the upload button element
    const editButton = document.querySelector('img[onclick="toggleEditMode()"]'); // Get the edit button element

    if (role !== 'lecturer') {
        if (uploadButtonContainer) uploadButtonContainer.style.display = 'none'; // Hide upload button
        if (editButton) editButton.style.display = 'none'; // Hide edit button
    }
}

// Function to create a new sub-lecture
async function createNewSubLecture() {
    const name = document.getElementById('newSubLectureName').value;
    const description = document.getElementById('newSubLectureDescription').value;
    const duration = document.getElementById('newSubLectureDuration').value;
    const video = document.getElementById('newSubLectureVideo').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('video', video);
    formData.append('lectureID', currentLectureID);

    try {
        const response = await fetch(`/lectures/${currentLectureID}/sublectures`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            $('#createSubLectureModal').modal('hide');
            loadCourseDetails(); // Reload course details
        } else {
            const errorData = await response.json();
            alert(`Error creating sub-lecture: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error creating sub-lecture:', error);
        alert('Failed to create sub-lecture: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    hideButtonsIfNotLecturer(); // Hide buttons if the user is not a lecturer
    loadCourseDetails(); // Load course details

    // Handle edit lecture form submission
    $('#editLectureForm').submit(async function(event) {
        event.preventDefault();
        await editLecture(); // Update lecture details
    });

    // Handle edit sub-lecture form submission
    $('#editSubLectureForm').submit(async function(event) {
        event.preventDefault();
        await editSubLecture(); // Update sub-lecture details
    });

    // Show the create new sub-lecture modal
    document.getElementById('createNewSubLectureButton').addEventListener('click', () => {
        $('#createSubLectureModal').modal('show');
    });

    // Handle new sub-lecture form submission
    $('#newSubLectureForm').submit(async function(event) {
        event.preventDefault();
        await createNewSubLecture(); // Create new sub-lecture
    });
});
