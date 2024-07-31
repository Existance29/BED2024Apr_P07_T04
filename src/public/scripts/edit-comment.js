
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const commentID = urlParams.get('commentID');
    
    if (commentID) {
        fetch(`http://localhost:3000/comments/${commentID}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("editCommentMessage").value = data.message;
                document.getElementById("editCommentRating").value = data.rating;
            })
            .catch(error => {
                console.error('Error fetching comment:', error);
                alert('Error fetching comment details.');
            });
    }

    document.getElementById("editCommentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const updatedComment = {
            message: document.getElementById("editCommentMessage").value,
            rating: document.getElementById("editCommentRating").value
        };

        fetch(`http://localhost:3000/comments/${commentID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedComment)
        })
        .then(response => response.json())
        .then(data => {
            window.history.back(); // Go back to the previous page
            alert("Comment updated successfully!");
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            alert('Error updating comment.');
        });
    });
});

function goBack() {
    window.history.back();
}