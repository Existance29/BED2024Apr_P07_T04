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
    const response = await post(`/users/login`,{email:emailInput.value, password: passwordInput.value})
    //check if login successful
    if (response.status == 404){
        //clear password field
        passwordInput.value = ""
        //display error message
        errorMsg.style.display = "block"
        return
    }
    //login successful
    
    const token = (await response.json()).accessToken
    //store the token in a session storage
    //store it in local if remember me is enabled
    sessionStorage.accessToken = token
    
    if (rememberInput.checked) localStorage.accessToken = token 

    //redirect user to courses
    window.location.href = "../courses.html"
    
    
}
