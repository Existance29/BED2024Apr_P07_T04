const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const rememberInput = document.getElementById("remember-me")
const errorMsg = document.getElementById("error-msg")

emailInput.addEventListener("input", inputChanged)
passwordInput.addEventListener("input", inputChanged)

//redirect to home if user is already logged in
guardAlreadyLoginPage()
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
    
    const token = await response.json();
    const accessToken = token.accessToken;
    const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
    const role = decodedToken.role;
  
    // Store the token and role in session storage
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('role', role);
  
    // Store in local if remember me is enabled
    if (rememberInput.checked) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);
    }
    //redirect user to courses
    window.location.href = "../courses.html"
    
    
}
