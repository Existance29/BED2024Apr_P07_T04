document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the access token and role from session storage or local storage
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role") || localStorage.getItem("role");
    const params = new URLSearchParams(window.location.search); // Parse URL parameters
    const courseID = params.get('courseID'); // Get the course ID from the URL

    console.log('Course ID from URL:', courseID); // Log the course ID

    // Add event listeners to the lecture and sub-lecture upload forms
    document.getElementById('lectureUploadForm').addEventListener('submit', handleLectureSubmit);
    document.getElementById('subLectureUploadForm').addEventListener('submit', handleSubLectureSubmit);
    document.getElementById('finishButton').addEventListener('click', function() {
        window.location.href = `course-chapters.html?courseID=${courseID}`; // Redirect to the course chapters page
    });

    // Handle lecture form submission
    async function handleLectureSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const form = document.getElementById('lectureUploadForm'); // Get the lecture upload form element
        const formData = new FormData(form); // Create a FormData object from the form

        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            // Send a POST request to upload the lecture
            const lectureResponse = await fetch('/lectures', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the access token in the headers
                }
            });

            const responseText = await lectureResponse.text(); // Get the raw response text
            console.log('Raw response from server:', responseText); // Log the raw response

            if (!lectureResponse.ok) {
                const errorData = JSON.parse(responseText); // Parse the error response
                console.error('Error response from server:', errorData); // Log the error
                if (errorData.message.includes("Lecture name already exists")) {
                    alert("Lecture name already exists. Please choose a different name.");
                } else {
                    alert(`Error uploading lecture: ${errorData.message}`);  // Display an alert with the error message
                }
                return;
            }

            const lectureResult = JSON.parse(responseText); // Parse the successful response
            console.log('Lecture response from server:', lectureResult); // Log the response

            // Set the lectureID for the sub-lecture form
            document.getElementById('lectureID').value = lectureResult.lectureID;

            // Show the sub-lecture form
            document.getElementById('lectureUploadForm').style.display = 'none';
            document.getElementById('subLectureUploadForm').style.display = 'block';
            alert('Lecture uploaded successfully! Now you can upload sub-lectures.');
        } catch (error) {
            console.error('Error uploading lecture:', error); // Log the error
            alert('Failed to upload lecture: ' + error.message); // Display an alert with the error message
        }
    }

    // Handle sub-lecture form submission
    async function handleSubLectureSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const form = document.getElementById('subLectureUploadForm'); // Get the sub-lecture upload form element
        const formData = new FormData(form); // Create a FormData object from the form

        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const lectureID = formData.get('lectureID'); // Get the lecture ID from the form data

        try {
            // Send a POST request to upload the sub-lecture
            const subLectureResponse = await fetch(`/lectures/${lectureID}/sublectures`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the access token in the headers
                }
            });

            const responseText = await subLectureResponse.text(); // Get the raw response text
            console.log('Raw response from server:', responseText); // Log the raw response

            if (!subLectureResponse.ok) {
                const errorData = JSON.parse(responseText); // Parse the error response
                console.error('Error response from server:', errorData); // Log the error
                if (errorData.message.includes("Sub-lecture name already exists")) {
                    alert("Sub-lecture name already exists for this lecture. Please choose a different name.");
                } else {
                    alert(`Error uploading sub-lecture: ${errorData.message}`); // Display an alert with the error message
                }
                return;
            }

            const subLectureResult = JSON.parse(responseText); // Parse the successful response
            console.log('Sub-lecture response from server:', subLectureResult); // Log the response

            alert('Sub-lecture uploaded successfully! You can add another one or finish.');

            // Reset the sub-lecture form for another submission
            form.reset();
            document.getElementById('finishButton').style.display = 'block';
        } catch (error) {
            console.error('Error uploading sub-lecture:', error); // Log the error
            alert('Failed to upload sub-lecture: ' + error.message); // Display an alert with the error message
        }
    }

    // Retrieve the courseID from the URL and set it in the form
    if (courseID) {
        console.log('Course ID from URL:', courseID); // Log the course ID
        document.getElementById('courseID').value = courseID; // Set the course ID in the form
    }
});
