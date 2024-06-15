const tabs = Array.prototype.slice.call(document.getElementsByClassName("side-select"))
const tabContents = Array.prototype.slice.call(document.getElementsByClassName("tab-content"))
const settingTitle = document.getElementById("settings-title")
const settingDesc = document.getElementById("settings-desc")

//api 
const userid = getUserID()
const initialData = get(`/users/complete/${userid}`)

//input fields
const profileImg = document.getElementById("profile-img")
const imgInput = document.getElementById("upload-img")
const firstName = document.getElementById("first_name")
const lastName = document.getElementById("last_name")
const email = document.getElementById("email")
const country = document.getElementById("country")
const aboutMe = document.getElementById("about_me")
const currentPassword = document.getElementById("current_password")
const newPassword = document.getElementById("new_password")
const repeatNewPassword = document.getElementById("repeat_new_password")



// Now, you can safely use .forEach()
tabs.forEach( (ele) => {
    ele.addEventListener("click", () => {
        switchTab(ele)
    });
})


//switch tabs
//hide and show tabs based on the element clicked
function switchTab(tabEle){
    //remove active class from all tabs
    tabs.forEach((ele) => {
        ele.classList.remove("active")
    })
    //hide all tab contents
    tabContents.forEach((ele) => {
        ele.style.display = "none"
    })

    //add active class and show tab
    tabEle.classList.add("active")
    document.getElementById(`${tabEle.id}-tab`).style.display = "block"
    //update the title and desc of the setting tab with the data attributes
    settingDesc.innerText = tabEle.dataset.desc
    settingTitle.innerText = tabEle.dataset.title
}

function imageInput(){
    profileImg.src = URL.createObjectURL(imgInput.files[0])
}

function saveAccount(){
    //save profile img
    var formDataSend = new FormData();
    formDataSend.append("pic",imgInput.files[0], "fileName.jpg");
    fetch(`/users/update/pic/${userid}`, {method: "POST", body: formDataSend})
}

async function reset(){
    //take initial data
    const response = await initialData
    if (response.status == 500) return
    //cant find user
    if (response.status == 404){
        //log user out and redirect to login page
        localStorage.removeItem("userid")
        sessionStorage.removeItem("userid")
        window.location.href = "login.html"
        return
    }
    const data = await response.json()

    //set input values
    profileImg.src = `data:image/png;base64,${data.img}`
    firstName.value = data.first_name
    lastName.value = data.last_name
    email.value = data.email
    country.value = data.country
    aboutMe.value = data.about_me
    currentPassword.value = ""
    newPassword.value = ""
    repeatNewPassword.value = ""
}

//call functions on load
reset()
switchTab(document.getElementById("account"))