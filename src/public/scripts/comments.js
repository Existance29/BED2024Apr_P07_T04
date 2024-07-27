//
async function fetchComments() {
  const response = await fetch("/comments"); // Replace with your API endpoint
  const data = await response.json();

  console.log(data)

  const commentList = document.getElementById("comment-list");
  
    data.forEach((comment) => {
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment"); // Add a CSS class for styling
  
      // Create elements for title, message, etc. and populate with comment data
      const titleElement = document.createElement("h2");
      titleElement.textContent = comment.commentID;
  
      const messageElement = document.createElement("p");
      messageElement.textContent = `${comment.message}`;
  
      // ... add more elements for other comment data (optional)
  
      commentItem.appendChild(titleElement);
      commentItem.appendChild(messageElement);
      // ... append other elements
  
      commentList.appendChild(commentItem);
    });
  }
  
fetchComments(); // Call the function to fetch and display comment data

function displayComments(comments) {
  const commentList = document.getElementById("comment-list");
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <div class="review">
        <h2>${comment.commentID}</h2>
        <p>${comment.message}</p>
      </div>
    `;
    commentList.appendChild(commentsDiv);
  });
}
