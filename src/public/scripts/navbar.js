//check if the user is logged in, if they are, display profile icon, else display login button
if (isLoggedIn()){
    document.getElementById("profile").style.display = "block" 
    const userid = getUserID()

    //use asynchronous fetch, we want the header and content to load asap
    fetch(`/users/complete/${userid}`)
    .then((response) => response.json())
    .then((body) => {
        document.getElementById("nav-profile-img").src = `data:image/png;base64,${body.img}`
    })
}else{
    document.getElementById("login").style.display = "block"
}


function logout(){
    //remove userID from storage and redirect user
    localStorage.removeItem("userid")
    sessionStorage.removeItem("userid")
    window.location.href = "../index.html"

}