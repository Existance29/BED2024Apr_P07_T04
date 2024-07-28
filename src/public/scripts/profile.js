const userID = getUrlParameter("user")
const loggedInUserID = getUserID()
//define the descriptions for each tooltip
const tooltipDesc = {
    "accuracy": "Users that answer quiz questions correctly",
    "versatility": "Users that are versatile and\ncomplete courses from different categories",
    "activity": "Users that are active and frequently\ncomment"
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function readableDate(timestamp){
    //extract date from timestamp (string) in format: DD MMM YY
    //DD: 2 digits for day, MMM: first 3 chars of the month, YYYY: year

    //extract date from timestamp and split based on dash
    let date = ((timestamp.split("T")[0]).split("-")).reverse()

    //convert month to format
    const monthNumToName = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "July",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    }
    date[1] = monthNumToName[date[1]]
    return date.join(" ")
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

async function loadProfile(){
    const response = await get(`/users/complete/${userID}`)
    //handle different responses
    if (response.status == 404){
        //user not found
        const content = document.getElementById("loading-main")
        content.innerHTML = `<h2 style = "color:white; font-size: 2vw">404 User Not Found</h2>`
        content.innerHTML += `<div style = "color:white; font-size: 1.2vw; margin-top:2vw">We couldn't find this user. Maybe the user has been deleted, or possibly never existed</div>`
        content.style.minHeight = "100vh"
        loadContent()
        return

    }else if (response.status = 500){
        //error
    }

    //if user is view their own profile, show edit icon
    if (userID == loggedInUserID){
        console.log("a")
        document.getElementById("edit-icon").style.display = "block"
    }
    const data = await response.json()
    console.log(data)

    //display the user data
    document.getElementById("profile-img").src = `data:image/png;base64,${data.img}`
    document.getElementById("full-name").innerText = `${data.first_name} ${data.last_name}`
    document.getElementById("country").innerText = data.country
    document.getElementById("job-title").innerText = data.job_title
    document.getElementById("about-me").innerText = data.about_me
    document.getElementById("progress-courses").innerText = data.completed_courses ? data.completed_courses.length : 0
    document.getElementById("progress-questions").innerText = data.questions_completed
    document.getElementById("role").innerText = title(data.role)

    //get courses
    const courses = await (await get("/courses/without-video")).json()
    console.log(courses)
    //display completed courses
    //check if completed_courses is null (user has not completed any courses)
    const completedCourses = document.getElementById("course-section")

    if (!data.completed_courses){
        completedCourses.innerHTML += "User has not completed any courses"
    } else{
        //there are courses to display
        completedCourses.innerHTML += `<div class = "course-seperator"></div>`
        data.completed_courses.forEach((completedCourse) => {
            const course = courses.filter(x => x.courseID === completedCourse.course_id)[0]
            const html = `
            <div id = "course" style="width: 100%">
                <div class = "d-flex course-content" onclick = "location.href = 'course-chapters.html?courseID=${completedCourse.course_id}'">
                    <img src="data:image/png;base64,${arrayBufferToBase64(course.thumbnail)}" class = "course-thumbnail">
                    <div class = "d-flex flex-column justify-content-between" style = "margin-left: 2vw;">
                        <div class = "poppins-medium course-title">${course.title}</div>
                        <div class = "poppins-medium course-complete-date">Completed on: ${readableDate(completedCourse.date_completed)}</div>
                    </div>
                </div>
                <div class = "course-seperator"></div>
            </div>
            `
            completedCourses.innerHTML += html
        })
    }

    //show the profile
    loadContent()

    //load the chart and calculate the data values
    const accuracy = roundToTwo(data.quiz_accuracy)*10
    let versatility = 0
    //generate a list of all course categories + categories of courses user has completed
    //calculate versatility
    if (data.completed_courses){
        let allCourseCategories = []
        let userCourseCategories = []
        courses.forEach((course) => {
            //get an array of all categories in the course
            const courseCategories = course.category.replaceAll(' ','').split(",")
            courseCategories.forEach((cat) => {
                //add all categories
                if (!allCourseCategories.includes(cat)) allCourseCategories.push(cat)
                //add categories of courses user has completed
                if (data.completed_courses.some( e => e.course_id === course.courseID) && !userCourseCategories.includes(cat)) userCourseCategories.push(cat)
            })
            }
        )
        versatility = roundToTwo(userCourseCategories.length/allCourseCategories.length)*10
    }
    loadChart([accuracy, versatility, 0])

}

loadProfile()

//create the chart

function loadChart(data){
    new Chart("radarChart", {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Versatility', 'Activity'],
            datasets: [{
                label: '',
                data: data,
                //set the style
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 0, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                r: {
                    max:10, //max and min values
                    min:0,
                pointLabels: {
                    font: {size:13} //set font size
                },
                ticks: {
                    display: false, // Hides the labels in the middle 
                    stepSize: 2 //adjust the number of lines 
                }
            }
        },
            plugins:{
                legend: {display: false}, //hide legend
                tooltip: {
                    callbacks: {
                    footer: (i) => tooltipDesc[i[0].label.toLowerCase()], //add description to tooltip
                    }
                }
            },
        }
    })
}

function editSettings(){
    location.href = "./settings.html"
}