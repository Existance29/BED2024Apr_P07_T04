//check if the user is logged in, if they are, display profile icon, else display login button

(isLoggedIn()) ? document.getElementById("profile").style.display = "block" 
: document.getElementById("login").style.display = "block"

function logout(){
    //remove userID from storage and redirect user
    localStorage.removeItem("userid")
    sessionStorage.removeItem("userid")
    window.location.href = "../index.html"

}