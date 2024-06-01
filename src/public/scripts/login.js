const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const rememberInput = document.getElementById("remember-me")
const errorMsg = document.getElementById("error-msg")

emailInput.addEventListener("input", inputChanged)
passwordInput.addEventListener("input", inputChanged)

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
    //if remember me enabled, store it in local storage, else store in session stoage
    rememberInput.checked ? localStorage.userid = id : sessionStorage.userid = id

    //redirect user to courses
    window.location.href = "../courses.html"
    
    
}

//prevent reloading page when form submitted
document.addEventListener("DOMContentLoaded", function () {
    //get all forms
    const forms = document.getElementsByTagName("form")
    //add listener to trigger when submitted
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        //stop reloading behaviour
        event.preventDefault()
      }, false)
    })
    
  
})
