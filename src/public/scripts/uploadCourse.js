// Retrieve the access token from session storage or local storage
const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = document.getElementById('courseUploadForm'); // Get the course upload form element
    const formData = new FormData(form); // Create a FormData object from the form

    // Log the form data for debugging
    console.log("Submitting form data:");
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(key + ': ' + value.name + ' (' + value.size + ' bytes)'); // Log file details
        } else {
            console.log(key + ': ' + value); // Log other form data
        }
    });

    try {
        // Send a POST request to upload the course
        const response = await fetch('/courses', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`, // Include the access token in the headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse the error response
            console.error('Error response from server:', errorData); // Log the error
            if (errorData.message.includes("Course title already exists")) {
                alert("Course title already exists. Please choose a different title."); // Display an alert for duplicate title
            } else {
                alert(`Error uploading course: ${errorData.message}`); // Display an alert with the error message
            }
            return;
        }

        const result = await response.json(); // Parse the successful response
        console.log('Response from server:', result); // Log the response
        alert('Course uploaded successfully!'); // Display a success message
        window.location.href = 'course-chapters.html?courseID=' + result.courseID; // Redirect to the course chapters page
    } catch (error) {
        console.error('Error uploading course:', error); // Log the error
        alert('Failed to upload course: ' + error.message); // Display an alert with the error message
    }
}

// Add an event listener to the form for the submit event
document.getElementById('courseUploadForm').addEventListener('submit', handleSubmit);
