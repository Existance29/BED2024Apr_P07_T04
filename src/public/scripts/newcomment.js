document.getElementById("commentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    let message = document.getElementById("commentMessage").value;
    let rating = document.getElementById("commentRating").value;

    if (message.trim() === "" || rating === "") {
        alert("Please fill out all fields.");
        return;
    }

    // Generate a unique comment ID (this is a simple example, you may want to use a more robust method)
    //let commentID = Date.now();
    //let userID = 1; // Replace this with the actual user ID
    //let subLectureID = 1; // Replace this with the actual subLecture ID

    // Create the comment object
    let newComment = {
        //commentID: commentID,
        //userID: userID,
        //subLectureID: subLectureID,
        message: message,
        rating: rating
    };

    // Send the POST request
    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.history.back(); //Return to the previous page
        alert("Comment posted successfully!");
        document.getElementById("commentForm").reset(); // Clear the form
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Error posting comment.");
    });
});
