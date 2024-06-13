// Fetch courses from the server
async function fetchCourses() {
    try {
        const response = await fetch("/courses/without-video"); 
        const courses = await response.json();
        return courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

// Convert binary data to base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
// Load the courses in the grid
async function loadCourses() {
    const courses = await fetchCourses();
    const grid = document.getElementById("system-grid"); // Clear grid
    grid.innerHTML = "";

    courses.forEach(course => {
        const rating = Math.round(course.TotalRate / course.Ratings);
        const thumbnailBase64 = arrayBufferToBase64(course.thumbnail.data);
        const systemHTML = `
            <div id="${course.title.toLowerCase()}" class="system@ ${course.category.split(',').join(" ")} rating:${rating}">
                <div class="system-logo">
                    <img src="data:image/png;base64,${thumbnailBase64}" style="width: 33%; margin: auto; display: block;">
                </div>
                <div class="system-info">
                    <h3 class="poppins-semibold system-name">${course.title}</h3>
                    <p class="poppins-regular system-desc">${course.description}</p>
                    
                </div>
                <div class="learn-btn-container">
                    <button type="submit" class="poppins-medium learn-btn" onclick="goCourse('${course.courseID}')">Learn Now</button>
                </div>
            </div>`;
        grid.innerHTML += systemHTML; // Add to grid
    });
}


// Return the html for the title of a new filter section
function filterSection(title) {
    return `<h4 class="exo-semibold" style="font-size: 0.95vw; margin-bottom: 1vw; margin-top: 2.5vw;">${title}</h4>`;
}

async function loadFilters() {
    const courses = await fetchCourses();
    const categoryDiv = document.getElementById("filters"); // Get div

    const categories = {};
    courses.forEach(course => {
        const cats = course.category.split(","); // assuming Category is a comma-separated string
        cats.forEach(c => {
            if (categories[c]) {
                categories[c] += 1;
            } else {
                categories[c] = 1;
            }
        });
    });

    let out = "";
    // Add category filters
    for (const [key, value] of Object.entries(categories)) {
        const html = `
        <tr>
            <td>
                <div class="checkbox-full">
                    <label class="check-container">
                        <input type="checkbox" class="categoryCheckbox" value="" id="${key}">
                        <span class="checkmark"></span>
                    </label>
                    <label class="form-check-label" style="margin-left: 1.25rem;">${title(key)}</label>
                </div>
            </td>
            <td>
                <label class="form-check-label form-count">${value}</label>
            </td>
        </tr>`;
        out += html;
    }

    out += filterSection("Reviews");

    // Add review filters
    for (let i = 5; i > 0; i--) {
        const html1 = `
        <tr>
            <td>
                <div class="checkbox-full">
                    <label class="check-container">
                        <input type="checkbox" class="categoryCheckbox" value="" id="rating:${i}">
                        <span class="checkmark"></span>
                    </label>
                    <div class="d-flex align-items-center" style="margin-left: 1.25rem; column-gap: 0.35vw;">`;
        const html2 = `
                        </div>
                    </div>
                </td>
                <td>
                    <label class="form-check-label form-count">6</label>
                </td>
        </tr>`;
        // Add the HTML for number of stars
        const htmlStar = `<img src="../assets/courses-page/fill-star-icon.png" style="height: 0.6vw;">`.repeat(i) +
            `<img src="../assets/courses-page/empty-star-icon.png" style="height: 0.6vw;">`.repeat(5 - i);
        // Add to output
        out += html1 + htmlStar + html2;
    }
    // Load into HTML
    categoryDiv.innerHTML += out;
}

function topicOnLoad() {
    loadCourses(); // Load courses
    loadFilters();
}

// Filter systems
function search() {
    // Get input and convert to lowercase
    const input = document.getElementById("search").value.toLowerCase();
    // Get the system elements and iterate through each one, checking if they should be shown
    const items = document.getElementsByClassName("system@");
    for (let i = 0; i < items.length; i++) {
        const ele = items[i];
        // Check if input is a substring of the id
        if (ele.id.indexOf(input) > -1) {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    }
}

function goCourse(courseID) {
    window.location.href = `course-chapters.html?courseID=${courseID}`;
}

document.addEventListener("DOMContentLoaded", topicOnLoad);
