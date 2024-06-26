const first_nameInput = document.getElementById("first-name")
const last_nameInput = document.getElementById("last-name")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")

first_nameInput.addEventListener("input", inputChanged)
last_nameInput.addEventListener("input", inputChanged)
emailInput.addEventListener("input", inputChanged)
passwordInput.addEventListener("input", inputChanged)


//redirect to home is logged in
if (isLoggedIn()) location.href = "./courses.html"

//hide the error message when the input field is changed
function inputChanged(e){
    //get the associated error message based on the id of the input field
    const error = document.getElementById(`${e.target.id.replaceAll("-","_")}-error`)
    error.style.display = "none"
}
function hideErrors(){
    //hide all error messages
    const errors = document.getElementsByClassName("field-error")
    for (var i = 0; i < errors.length; i++){
        errors[i].style.display = "none"
    }
}


async function signUp(){
    hideErrors()
    const user = {
        "first_name": first_nameInput.value,
        "last_name": last_nameInput.value,
        "email": emailInput.value,
        "password": passwordInput.value,
        "about_me": "",
        "country": (await (await get("http://ip-api.com/json")).json()).country //auto-detect the user's country
    }
    //update database
    const response = await post("/users", user)
    const body = await response.json()
    //check if inputs were invalid
    if (response.status == 400 && "message" in body){
        //iterate through all errors, display the error message
        for (var i = 0; i < body.errors.length; i++){
            const x  = body.errors[i]
            console.log(x[0])
            const errorEle = document.getElementById(`${x[0]}-error`) //get the error messasge element associated with the error
            errorEle.innerText = x[1].replaceAll("_"," ").replaceAll('"','') //do a bit of formatting to make the message more readable
            errorEle.style.display = "block"
        }
        return
    }

    //valid input
    //save the user id to session storage
    sessionStorage.userid = body.id
    //redirect user to courses
    window.location.href = "../courses.html"
    
}