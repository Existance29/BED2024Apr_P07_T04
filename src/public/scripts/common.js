//this file stores common functions to be used in other scripts

//load the navbar html into the class
$(".nav-placeholder").load("./commonHTML/navbar.html", () => {

})

//load the footer html into the class
$(".footer-placeholder").load("./commonHTML/footer.html")

//load the header for course-view pages
$(".course-header-placeholder").load("./commonHTML/course-header.html")

//returns a string with title-casing
function title(str) {
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

//get the value of the url parameter of the current address
function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return decodeURI(sParameterName[1]);
        }
    }
}

//api functions
async function post(url, jsondata){
    let settings = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
  
      body: JSON.stringify(jsondata)
    }
    return await fetch(url, settings)
    
}

async function get(url){
    let settings = {
      method: "GET",
      crossDomain: true,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        
      }
    }
    return await fetch(url, settings)
  
}

async function put(url, jsondata){
  let settings = {
    keepalive: true,
    crossDomain: true,
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache"
    },
    body: JSON.stringify(jsondata)
  }

  return await fetch(url, settings)
  
}

//check if user is logged in 
function isLoggedIn(){
    //check both local and session storage
    var localUser = localStorage.userid
    var sessionUser = sessionStorage.userid
    //if localuser or sessionuser exist, user is logged in
    return !(localUser == null && sessionUser === undefined && sessionUser == null && sessionUser === undefined)
}

//returns the user id stored in local/session storage
function getUserID(){
  if (sessionStorage.userid != null){
    return sessionStorage.userid

  } else if (localStorage.userid != null){
    return localStorage.userid
  } 

  return null
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

