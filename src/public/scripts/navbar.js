
const navSearchBarForm = document.getElementById("nav-search-bar-form")
const navSearchBarDiv = document.getElementById("nav-search-bar")
const navSearchBar = document.querySelector("#nav-search-bar input")

async function loadNavBar(){
    //check if the user is logged in, if they are, display profile icon, else display login button (by triggering logout)
    const loggedIn = await isLoggedIn()
    if (loggedIn){
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
        logout(false)
    }
}

function searchBar(){
    for (const x of document.getElementsByClassName("search-bar-hide")){
        x.style.display = "none"
    }
    //show the search bar
    navSearchBarForm.style.display = "flex"
    //trigger the animation
    navSearchBarDiv.classList.add("active")

}

function hideSearchBar(){
    //hide the search bar
    navSearchBarForm.style.display = "none"
    //remove the class (so it can be triggered again)
    navSearchBarDiv.classList.remove("active")
    //also clear the text
    navSearchBar.value = ""
    //note: only 1 li element uses flex, but its fine to force display to flex instead of block since its just text
    for (const x of document.getElementsByClassName("search-bar-hide")){
        x.style.display = "flex"
    }
}

navSearchBarDiv.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        console.log(navSearchBar.value)
    }
})

loadNavBar()



function goToProfile(){
    const userID = getUserID()
    location.href = `../profile.html?user=${userID}`
}

function logout(redirect=true){
    //show login button and hide profile icon
    document.getElementById("login").style.display = "block"
    document.getElementById("profile").style.display = "none" 
    //remove access token cookie
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("accessToken")
    if (redirect) window.location.href = "../index.html"

}