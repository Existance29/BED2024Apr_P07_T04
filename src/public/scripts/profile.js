const userID = getUrlParameter("user")
//define the descriptions for each tooltip
const tooltipDesc = {
    "accuracy": "Users that answer quiz questions correctly",
    "versatility": "Users that are versatile and\ncomplete courses from different categories",
    "activity": "Users that are active and frequently\ncomment and rate courses"
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

async function loadProfile(){
    const response = await get(`/users/complete/${userID}`)
    //handle different responses
    if (response.status == 404){
        //user not found
    }else if (response.status = 500){
        //error
    }
    const data = await response.json()

    console.log(data)
    //display the user data
    document.getElementById("profile-img").src = `data:image/png;base64,${data.img}`
    document.getElementById("full-name").innerText = `${data.first_name} ${data.last_name}`
    document.getElementById("country").innerText = data.country
    document.getElementById("about-me").innerText = data.about_me
    document.getElementById("progress-courses").innerText = data.completed_courses.length
    document.getElementById("progress-questions").innerText = data.questions_completed

    //load the chart
    loadChart([roundToTwo(data.quiz_accuracy)*10, 8.5, 6])
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
                    max:10,
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