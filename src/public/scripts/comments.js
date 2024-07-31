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
          <p>(${comment.rating}/5) <a href="edit-comment.html?commentID=${comment.commentID}" class="edit-link">Edit</a></p>
        </div>
      `;
      commentList.appendChild(commentDiv);
    });
}
displayComments(); // Call the function to display comment data

