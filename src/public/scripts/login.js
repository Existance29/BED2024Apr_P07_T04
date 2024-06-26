const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const rememberInput = document.getElementById("remember-me")
const errorMsg = document.getElementById("error-msg")

emailInput.addEventListener("input", inputChanged)
passwordInput.addEventListener("input", inputChanged)

//redirect to home if user is already logged in
if (isLoggedIn()) location.href = "./courses.html"
//hide the error message when the input field is changed
function inputChanged(e){
    errorMsg.style.display = "none"
}

async function login(){
    const response = await get(`/users/login/${emailInput.value}/${passwordInput.value}`)
    //check if login successful
    if (response.status == 404){
        //clear password field
        passwordInput.value = ""
        //display error message
        errorMsg.style.display = "block"
        return
    }
    //login successful
    
    const id = (await response.json()).id
    //if remember me enabled, store it in local storage
    sessionStorage.userid = id
    if (rememberInput.checked) localStorage.userid = id 

    //redirect user to courses
    window.location.href = "../courses.html"
    
    
}
