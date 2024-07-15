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
    userResultsHTML = ''
    userResults.forEach(x => {

    })
}

getResults()