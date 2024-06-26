//check if the user is logged in, if they are, display profile icon, else display login button
if (isLoggedIn()){
    document.getElementById("profile").style.display = "block" 
    const userid = getUserID()

    //use asynchronous fetch, we want the header and content to load asap
    fetch(`/users/pic/${userid}`)
    .then((response) => {
        //cant find user in database, log out
        if (response.status == 404){
            logout(false)
            return null
        }
        return response.json()
    })
    .then((body) => {
        document.getElementById("nav-profile-img").src = `data:image/png;base64,${body.img}`
    })
}else{
    document.getElementById("login").style.display = "block"
}


function logout(redirect=true){
    //remove userID from storage and redirect user
    localStorage.removeItem("userid")
    sessionStorage.removeItem("userid")
    if (redirect) window.location.href = "../index.html"

}