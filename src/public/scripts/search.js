//get the filters
const filters = document.getElementById("search-filters").children
const resultDisplays = document.getElementsByClassName("results-display")
//get the query from the url. default to blank if no query is provided
const query = getUrlParameter("q") || ""
//display the search query
document.getElementById("search-query").innerText = query
//switch categories
function switchCategory(element){
    //unselect all filters
    Array.from(filters).forEach(x => x.classList.remove("active"))
    //show the filter is selected 
    element.classList.add("active")
    //show the search results, but first, hide them
    Array.from(resultDisplays).forEach(x => x.style.display = "none")
    //show the associated search result
    const category = element.id.split("-")[0]
    document.getElementById(`${category}-results`).style.display = "block"
}

//get search ressults from users and courses
//TODO: also get results from comments once if route is done
async function getResults(){
    //get the user results and add them to the html
    const userResults = await (await get(`/users/search?q=${query}`)).json()
    console.log(userResults)
    //display the user search results into the DOM
    let userResultsHTML = ''
    userResults.forEach(x => {
        userResultsHTML +=`
            <div class="user-result" style="margin-top: 1vw;" onclick = "window.location.href='./profile.html?user=${x.id}'">
                <div class="d-flex align-content-center">
                    <img src="data:image/png;base64,${x.img}">
                    <div class="poppins-medium" style="margin-left: 1vw; font-size: 1.1vw; display: flex; align-items: center;">${x.first_name} ${x.last_name}</div>
                </div>
                <div class="poppins-regular" style="margin-top: 1.3vw; font-size: 1vw;">${title(x.role)}</div>
                <div class="poppins-regular" style="font-size: 1vw; color: #272727;">${x.job_title}</div>
                <div class="poppins-regular" style="font-size: 1vw; color: #272727;">${x.country}</div>
            </div>
        `
    })
    document.getElementById('user-results').innerHTML = userResultsHTML
}

getResults()