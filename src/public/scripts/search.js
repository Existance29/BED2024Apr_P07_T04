//get the filters
const filters = document.getElementById("search-filters").children
const resultDisplays = document.getElementsByClassName("results-display")
//get the query from the url. default to blank if no query is provided
const query = getUrlParameter("q") || ""
//display the search query
document.getElementById("search-query").innerText = query

//html for filled/empty stars
const filledStar = '<img src="./assets/lectures/fill-star-icon.png">'
const emptyStar = '<img src="./assets/lectures/empty-star-icon.png">'

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

// Convert a buffer obj (binary data) to base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer.data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

//get search ressults from users and courses
//TODO: also get results from comments once if route is done
async function getResults(){
    //get the user results and add them to the DOM
    const userResults = await (await get(`/users/search?q=${query}`)).json()
    console.log(userResults)
    //display the user search results into the html
    let userResultsHTML = ''
    userResults.forEach(x => {
        userResultsHTML +=`
            <div class="card" onclick = "window.location.href='./profile.html?user=${x.id}'">
                <div class="avatar">
                    <img src="data:image/png;base64,${x.img}" alt="${x.first_name} ${x.last_name}" class="avatarImage">
                </div>
                <div class="cardTitle">${x.first_name} ${x.last_name}</div>
                <div class="cardDescription">${title(x.role)} - ${x.country}</div>
            </div>
        `
    })
    document.getElementById('user-results').innerHTML = userResultsHTML

    //get the course results and add them to the DOM
    const courseResults = await (await get(`/courses/search?q=${query}`)).json()
    console.log(courseResults)
    let courseResultsHTML = ''
    courseResults.forEach(x => {
        //calculate rating
        const rating = Math.round(x.totalRate / x.ratings)
        //the way stars are display are just if-else statements
        courseResultsHTML +=`
            <div class="card" onclick = "location.href = 'course-chapters.html?courseID=${x.courseID}'">
                <div class="d-flex align-content-center">
                    <img class = "course-img" src="data:image/png;base64,${arrayBufferToBase64(x.thumbnail)}">
                    <div style="margin-left: 1.5vw;">
                        <div class="poppins-medium" style="font-size: 1vw">${x.title}</div>
                        <div class="poppins-regular" style="font-size: 0.95vw;">${x.description}</div>
                        <div class="d-flex course-ratings" style="margin-top: 0.5vw; gap: 0.4vw;">
                            ${rating >= 1? filledStar: emptyStar}
                            ${rating >= 2? filledStar: emptyStar}
                            ${rating >= 3? filledStar: emptyStar}
                            ${rating >= 4? filledStar: emptyStar}
                            ${rating >= 5? filledStar: emptyStar}
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    document.getElementById('course-results').innerHTML = courseResultsHTML
    
    //if no course results are present, auto-switch to user
    //theres no need to do it for user since course is default
    if (!courseResults.length && userResults.length) switchCategory(document.getElementById('user-filter'))
}

getResults()