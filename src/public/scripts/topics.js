//to replace with a get request
const systemData = [
    {
        "title": "Angular JS",
        "thumbnail": "angular-js.png",
        "description": "A JavaScript-based open-source front-end web framework for developing single-page applications.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 2000,
        "ratings": 500,

    },
    {
        "title": "AWS",
        "thumbnail": "aws.png",
        "description": "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 1200,
        "ratings": 500,
    },
    {
        "title": "Vue JS",
        "thumbnail": "vue-js.png",
        "description": "An open-source model-view–viewmodel front end JavaScript framework for building user interfaces & single-page applications.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 1000,
        "ratings": 500,
    },
    {
        "title": "Python",
        "thumbnail": "python.png",
        "description": "Python is an interpreted high-level general-purpose programming language.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 400,
        "ratings": 200,
    },
    {
        "title": "React JS",
        "thumbnail": "react-js.png",
        "description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 3000,
        "ratings": 5000,
    },
    {
        "title": "Software Testing",
        "thumbnail": "software-testing.png",
        "description": "The process of evaluating and verifying that a software product or application does what it is supposed to do.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 6000,
        "ratings": 2000,
    },
    {
        "title": "Core UI",
        "thumbnail": "core-ui.png",
        "description": "Learn the fastest way to build a modern dashboard for any platforms, browser, or device.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 6000,
        "ratings": 3000,
    },
    {
        "title": "Power BI",
        "thumbnail": "power-bi.png",
        "description": "An interactive data visualization software developed by Microsoft with primary focus on business intelligence.",
        "category": ["commercial", "office", "shop", "educate", "acedemy", "single family home", "studio", "university"],
        "total rate": 8000,
        "ratings": 7000,
    },
    
]

//load the topics in a grid format
function loadTopics(){
    const grid = document.getElementById("system-grid") //clear grid
    grid.innerHTML = ""
    for (i in systemData){
        //get the data for each topic
        system = systemData[i]
        //calculate the average rating and round up
        const rating = Math.round(system["total rate"]/system["ratings"])
        const systemHTML = `            
            <div id = "${system["title"].toLowerCase()}" class = "system@ ${system["category"].join(" ")} rating:${rating}">
                <div class = "system-logo">
                    <img src = "./assets/courses/topic-thumbnail/${system["thumbnail"]}" style="width: 33%; margin: auto; display: block;">
                </div>
                <div class = "system-info">
                    <h3 class = "poppins-semibold system-name">${system["title"]}</h3>
                    <p class = "poppins-regular system-desc">${system["description"]}</p>
                    <div class="d-flex justify-content-center">
                        <div class = "d-flex poppins-semibold align-items-center extra-options">
                            <img src="./assets/courses-page/demo-icon.png" style="width: 15%; margin-right: 0.3vw;">
                            Live Demo
                        </div>
                        <div class = "d-flex poppins-semibold align-items-center extra-options">
                            <img src="./assets/courses-page/pin-icon.png" style="width: 15%; margin-right: 0.3vw;">
                            Enroll Now
                        </div>
                    </div>
                </div>
                <div class = "learn-btn-container">
                    <button type="submit" class="poppins-medium learn-btn" onclick = "goCourse('${system["title"].toLowerCase()}')">Learn Now</button>
                </div>
            </div>`
        
        grid.innerHTML += systemHTML //add to grid
    }
}

//return the html for the title of a new filter section
function filterSection(title){
    return `<h4 class = "exo-semibold" style="font-size: 0.95vw; margin-bottom: 1vw; margin-top: 2.5vw;">${title}</h4>`
}

function loadFilters(){
    const categoryDiv = document.getElementById("filters") //get div

    //TODO: get number of stars for the star filter
    //get unique categories from each course and count them
    //key: category name, value: number of courses with this category
    var categories = {}
    for (i in systemData){
        //get the data for each system
        cats = systemData[i]["category"]
        for (j in cats){
            c = cats[j]
            if (c in categories){
                categories[c] += 1
            }else{
                categories[c] = 1   
            }
        }
    }

    var out = ""
    //add category filters
    for (const [key, value] of Object.entries(categories)) {
        const html = `
        <tr>
            <td>
                <div class = "checkbox-full">
                    <label class="check-container">
                        <input type="checkbox" class = "categoryCheckbox" value="" id = "${key}">
                        <span class="checkmark"></span>
                    </label>
                    <label class="form-check-label" style="margin-left: 1.25rem;">${title(key)}</label>
                </div>
            </td>

            <td>
                <label class="form-check-label form-count">${value}</label>
            </td>
        </tr>
        `
        out += html
    }

    out += filterSection("Reviews")
    
    //add review filters

    for (var i = 5; i > 0; i--){
        const html1 = `
        <tr>
            <td>
                <div class = "checkbox-full">
                    <label class="check-container">
                        <input type="checkbox" class = "categoryCheckbox" value="" id = "rating:${i}">
                        <span class="checkmark"></span>
                    </label>
                    <div class = "d-flex align-items-center" style="margin-left: 1.25rem; column-gap: 0.35vw;">
        `
        const html2 = `
                    </div>
                </div>
            </td>

            <td>
                <label class="form-check-label form-count">6</label>

            </td>
        </tr>
        `

        //add the html for number of stars
        const htmlStar = `<img src = "./assets/courses-page/fill-star-icon.png" style="height: 0.6vw;">`.repeat(i) + 
            `<img src = "./assets/courses-page/empty-star-icon.png" style="height: 0.6vw;">`.repeat(5-i)
        //add to out
        out += html1 + htmlStar + html2
    }
    
    //load into html
    categoryDiv.innerHTML += out
}

function topicOnLoad(){
    loadTopics() //load topics
    loadFilters()
}

function courseOnLoad(){
    loadFilters()
    const topic = getUrlParameter("topic")
    console.log(topic)
    //TODO: Account for cases where no topic param is given
}

//filter systems
function search(){
    //get input
    //set to lowercase so casing is irrelevant
    const input = document.getElementById("search").value.toLowerCase() 
    //get the system elements and iterate through each one, check if they should be shown
    const items = document.getElementsByClassName("system@")
    for(var i = 0; i < items.length; i++){
        ele = items[i]
        //check if input is a substring of the id
        if (ele.id.indexOf(input) > -1){
            ele.style.display = "block"
        }else{
            ele.style.display = "none"
        }
    }
}

function goCourse(topic){
    console.log(topic)
    window.location.href = `../courses.html?topic=${topic}`
}