async function displayComments() {
  const response = await fetch("/comments");
    const data = await response.json();
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = '';
    data.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      commentDiv.innerHTML = `
        <div class="review">
          <!--<h2>${comment.commentID}</h2>-->
          <p>${comment.message}</p>
          <p>(${comment.rating}/5) <a href="edit-comment.html?commentID=${comment.commentID}" class="edit-link">Edit</a> <a href="delete-comment.?commentID=${comment.commentID}"</p>
          <a href="#" class="delete-link" onclick="deleteComment(${comment.commentID})">Delete</a>
        </div>
      `;
      commentList.appendChild(commentDiv);
    });
}

async function deleteComment(commentID) {
  if (confirm("Are you sure you want to delete this comment?")) {
      try {
          const response = await fetch(`/comments/${commentID}`, {
              method: 'DELETE'
          });
          if (response.status === 204) {
              alert("Comment deleted successfully!");
              displayComments(); // Refresh the comment list
          } else {
              alert("Error deleting comment.");
          }
      } catch (error) {
          console.error('Error:', error);
          alert("Error deleting comment.");
      }
  }
}
displayComments(); // Call the function to display comment data

