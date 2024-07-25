function postComment() {
    let commentInput = document.getElementById("commentInput").value;
    if (commentInput.trim() === "") {
        alert("Comment cannot be empty.");
        return;
    }

    // You can add code here to send the comment to your server

    // Clear the textarea after posting the comment
    document.getElementById("commentInput").value = "";
    alert("Comment posted successfully!");
}

function cancelComment() {
    document.getElementById("commentInput").value = "";
}
