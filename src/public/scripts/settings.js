const tabs = Array.prototype.slice.call(document.getElementsByClassName("side-select"))
const tabContents = Array.prototype.slice.call(document.getElementsByClassName("tab-content"))
const settingTitle = document.getElementById("settings-title")
const settingDesc = document.getElementById("settings-desc")
const profileImg = document.getElementById("profile-img")
const imgInput = document.getElementById("upload-img")

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

async function imageInput(){
    const blobFile = imgInput.files[0]
    profileImg.src = URL.createObjectURL(blobFile)
    var formDataSend = new FormData();
    formDataSend.append("file", blobFile, "fileName.jpg");
    await fetch("/users/pic/1", {method: "POST", body: formDataSend})
}

switchTab(document.getElementById("account"))