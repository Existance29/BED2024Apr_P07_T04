//to replace with a get request
const systemData = [
    {
        "title": "Angular JS",
        "thumbnail": "angular-js.png",
        "description": "A JavaScript-based open-source front-end web framework for developing single-page applications."

    },
    {
        "title": "AWS",
        "thumbnail": "aws.png",
        "description": "AWS Coaching and Certification helps you build and validate your skills so you can get more out of the cloud. "
    },
    {
        "title": "Vue JS",
        "thumbnail": "vue-js.png",
        "description": "An open-source model–view–viewmodel front end JavaScript framework for building user interfaces & single-page applications."
    },
    {
        "title": "Python",
        "thumbnail": "python.png",
        "description": "Python is an interpreted high-level general-purpose programming language."
    },
    {
        "title": "React JS",
        "thumbnail": "react-js.png",
        "description": "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. "
    },
    {
        "title": "Software Testing",
        "thumbnail": "software-testing.png",
        "description": "The process of evaluating and verifying that a software product or application does what it is supposed to do."
    },
    {
        "title": "Core UI",
        "thumbnail": "core-ui.png",
        "description": "Learn the fastest way to build a modern dashboard for any platforms, browser, or device. "
    },
    {
        "title": "Power BI",
        "thumbnail": "power-bi.png",
        "description": "An interactive data visualization software developed by Microsoft with primary focus on business intelligence."
    },
    
]


//load the courses in a grid format
function loadGrid(){
    const grid = document.getElementById("system-grid") //clear grid
    grid.innerHTML = ""
    for (i in systemData){
        //get the data for each system
        system = systemData[i]
        console.log(system)
        const systemHTML = `            
            <div>
                <div class = "system-logo">
                    <img src = "./assets/courses/system-thumbnail/${system["thumbnail"]}" style="width: 33%; margin: auto; display: block;">
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
                    <button type="submit" class="poppins-medium learn-btn">Learn Now</button>
                </div>
            </div>`
        
        grid.innerHTML += systemHTML //add to grid
    }
}