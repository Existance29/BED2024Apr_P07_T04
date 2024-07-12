document.getElementById('lectureUploadForm').addEventListener('submit', handleLectureSubmit);
const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
const role = sessionStorage.getItem("role") || localStorage.getItem("role");

async function handleLectureSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('lectureUploadForm');
    const formData = new FormData(form);

    // Log formData for debugging
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        const lectureResponse = await fetch('/lectures', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const responseText = await lectureResponse.text();
        console.log('Raw response from server:', responseText);

        if (!lectureResponse.ok) {
            const errorData = JSON.parse(responseText);
            console.error('Error response from server:', errorData);
            alert(`Error uploading lecture: ${errorData.message}`);
            return;
        }

        const lectureResult = JSON.parse(responseText);
        console.log('Lecture response from server:', lectureResult);

        // Set the lectureID for the sub-lecture form
        document.getElementById('lectureID').value = lectureResult.lectureID;

        // Show the sub-lecture form
        document.getElementById('lectureUploadForm').style.display = 'none';
        document.getElementById('subLectureUploadForm').style.display = 'block';
        alert('Lecture uploaded successfully! Now you can upload sub-lectures.');
    } catch (error) {
        console.error('Error uploading lecture:', error);
        alert('Failed to upload lecture: ' + error.message);
    }
}

document.getElementById('subLectureUploadForm').addEventListener('submit', handleSubLectureSubmit);

async function handleSubLectureSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('subLectureUploadForm');
    const formData = new FormData(form);

    // Log formData for debugging
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const lectureID = formData.get('lectureID');

    try {
        const subLectureResponse = await fetch(`/lectures/${lectureID}/sublectures`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });


        const responseText = await subLectureResponse.text();
        console.log('Raw response from server:', responseText);

        if (!subLectureResponse.ok) {
            const errorData = JSON.parse(responseText);
            console.error('Error response from server:', errorData);
            alert(`Error uploading sub-lecture: ${errorData.message}`);
            return;
        }

        const subLectureResult = JSON.parse(responseText);
        console.log('Sub-lecture response from server:', subLectureResult);

        alert('Sub-lecture uploaded successfully!');
        goCourse(subLectureResult.courseID); // Redirect to the course chapters page
    } catch (error) {
        console.error('Error uploading sub-lecture:', error);
        alert('Failed to upload sub-lecture: ' + error.message);
    }
}

function goCourse(courseID) {
    window.location.href = `course-chapters.html?courseID=${courseID}`;
}

// Retrieve the courseID from the URL and set it in the form
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const courseID = params.get('courseID');
    if (courseID) {
        console.log('Course ID from URL:', courseID);
        document.getElementById('courseID').value = courseID;
    }
});
