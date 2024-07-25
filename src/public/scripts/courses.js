var ratings = {5:0, 4:0, 3:0, 2:0, 1:0};
var categories = {};
const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
const role = sessionStorage.getItem("role") || localStorage.getItem("role");

console.log('Role:', role); // Debugging log

// Fetch courses from the server
let editMode = false;

// Function to toggle edit mode 
function toggleEditMode() {
    editMode = !editMode;
    loadCourses();
}

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

// Load the courses in the grid format
async function loadCourses() {
    const courses = await fetchCourses();
    const grid = document.getElementById("system-grid"); // Clear grid
    grid.innerHTML = "";

    // Also get the total number of ratings for each course and the course categories
    courses.forEach(course => {
        const rating = Math.round(course.totalRate / course.ratings);
        ratings[rating] += 1; // Update rating count obj

        const cats = course.category.split(","); // Assuming Category is a comma-separated string
        cats.forEach(c => {
            if (categories[c]) {
                categories[c] += 1;
            } else {
                categories[c] = 1;
            }
        });

        // The class names are categories for the filters
        // Each category is separated by a &. We can't use spaces to normally separate classes since some category names have spaces in them
        const thumbnailBase64 = arrayBufferToBase64(course.thumbnail.data);
        const editDeleteButtons = (editMode && role === 'lecturer') ? `
            <div class="edit-delete-buttons">
                <button class="edit-btn" onclick="editCourse('${course.courseID}')">
                    <img src="assets/lectures/edit-button.png" alt="Edit" style="width: 25px; height: 25px;">
                </button>
                <button class="delete-btn" onclick="confirmDeleteCourse('${course.courseID}')">
                    <img src="assets/lectures/delete.png" alt="Delete" style="width: 25px; height: 25px;">
                </button>
            </div>
        ` : '';

        const systemHTML = `
            <div id="${course.title.toLowerCase()}" class="system@ ${course.category.split(',').join("&")}&rating:${rating}">
                <div class="course-card">
                    ${editDeleteButtons}
                    <div class="system-logo">
                        <img src="data:image/png;base64,${thumbnailBase64}" style="width: 33%; margin: auto; display: block;">
                    </div>
                    <div class="system-info">
                        <h3 class="poppins-semibold system-name">${course.title}</h3>
                        <p class="poppins-regular system-desc">${course.caption}</p>
                    </div>
                    <div class="learn-btn-container">
                        <button type="submit" class="poppins-medium learn-btn" onclick="goCourse('${course.courseID}')">Learn Now</button>
                    </div>
                </div>
            </div>`;
        grid.innerHTML += systemHTML; // Add to grid
    });
}

// Confirm before sending DELETE request
function confirmDeleteCourse(courseID) {
    const isConfirmed = confirm("Are you sure you want to delete this course?");
    if (isConfirmed) {
        deleteCourse(courseID);
    }
}

// Send DELETE request to delete course
async function deleteCourse(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            // Course deleted successfully, reload the courses
            loadCourses();
        } else {
            console.error('Error deleting course:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting course:', error);
    }
}

// Return the HTML for the title of a new filter section
function filterSection(title) {
    return `<h4 class="exo-semibold" style="font-size: 0.95vw; margin-bottom: 1vw; margin-top: 2.5vw;">${title}</h4>`;
}

async function loadFilters() {
    const courses = await fetchCourses();
    const categoryDiv = document.getElementById("filters"); // Get div

    let out = "";
    // Add category filters
    for (const [key, value] of Object.entries(categories)) {
        const html = `
        <tr>
            <td>
                <div class="checkbox-full">
                    <label class="check-container">
                        <input type="checkbox" class="categoryCheckbox" value="" id="${key}" onclick="search()">
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
                        <input type="checkbox" class="ratingCheckbox" value="" id="rating:${i}" onclick="search()">
                        <span class="checkmark"></span>
                    </label>
                    <div class="d-flex align-items-center" style="margin-left: 1.25rem; column-gap: 0.35vw;">`;
        const html2 = `
                        </div>
                    </div>
                </td>
                <td>
                    <label class="form-check-label form-count">${ratings[i]}</label>
                </td>
        </tr>`;
        // Add the HTML for number of stars
        const htmlStar = `<img src="../assets/lectures/fill-star-icon.png" style="height: 0.6vw;">`.repeat(i) +
            `<img src="../assets/lectures/empty-star-icon.png" style="height: 0.6vw;">`.repeat(5 - i);
        // Add to output
        out += html1 + htmlStar + html2;
    }
    // Load into HTML
    categoryDiv.innerHTML += out;
}

async function topicOnLoad() {
    console.log('Role inside topicOnLoad:', role); // Debugging log
    const userRole = role;
    const uploadButtonContainer = document.getElementById('upload-button');
    const editButton = document.querySelector('img[onclick="toggleEditMode()"]');

    if (userRole !== 'lecturer') {
        if (uploadButtonContainer) uploadButtonContainer.style.display = 'none';
        if (editButton) editButton.style.display = 'none';
    }

    await loadCourses(); // Load courses
    await loadFilters();
}

// Filter systems
function search() {
    // Get all checkboxes
    // Store the enabled checkbox's ids and use those to filter
    const categoryFilters = Array.from(document.getElementsByClassName("categoryCheckbox"))
        .filter(ele => ele.checked)
        .map(ele => ele.id);

    const ratingFilters = Array.from(document.getElementsByClassName("ratingCheckbox"))
        .filter(ele => ele.checked)
        .map(ele => ele.id);

    // Get input and convert to lowercase
    const input = document.getElementById("search").value.toLowerCase();
    // Get the system elements and iterate through each one, checking if they should be shown
    const items = document.getElementsByClassName("system@");
    for (let i = 0; i < items.length; i++) {
        const ele = items[i];
        var show = false;
        ele.style.display = "none";
        // Check if input is a substring of the id
        // Also make sure it matches the checkbox's filters
        if (ele.id.indexOf(input) > -1) show = true;

        // Get the different filters by splitting by "&" (as loaded)
        // Need to split by space first to get rid of the "system@" class
        const filters = ele.className.split("system@ ")[1].split("&");
        const ratingFilter = filters.at(-1);
        const courseFilters = filters.slice(0, -1);

        // This is where the filtering differs
        // When it comes to course category, show only courses that match the course category (and)
        // When it comes to rating, show courses that meet at least one of the rating categories (or)
        for (const j in categoryFilters) {
            const e = categoryFilters[j];
            console.log(ratingFilter);
            // Check course filters
            if (!courseFilters.includes(e)) { 
                show = false;
                break;
            }
        }

        if (!show) continue;
        // Check rating filters (this should always be the last check)
        if (ratingFilters.length && !ratingFilters.includes(ratingFilter)) {
            ele.style.display = "none";
        } else {
            ele.style.display = "block";
        }
    }
}

function goCourse(courseID) {
    window.location.href = `course-chapters.html?courseID=${courseID}`;
}

document.addEventListener("DOMContentLoaded", topicOnLoad);

// Open update course modal and populate the form with course details
async function editCourse(courseID) {
    const course = await fetchCourseById(courseID);
    document.getElementById('updateCourseID').value = course.courseID;
    document.getElementById('updateTitle').value = course.title;
    document.getElementById('updateDescription').value = course.description;
    document.getElementById('updateDetails').value = course.details;
    document.getElementById('updateCaption').value = course.caption;
    document.getElementById('updateCategory').value = course.category;

    document.getElementById('updateCourseModal').style.display = 'block';
}

// Fetch course details by ID
async function fetchCourseById(courseID) {
    try {
        const response = await fetch(`/courses/${courseID}/without-video`);
        const course = await response.json();
        return course;
    } catch (error) {
        console.error('Error fetching course details:', error);
        return null;
    }
}

// Close update course modal
function closeUpdateCourseModal() {
    document.getElementById('updateCourseModal').style.display = 'none';
}

// Update course details
async function updateCourse(event) {
    event.preventDefault();
    const courseID = document.getElementById('updateCourseID').value;
    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDescription').value;
    const details = document.getElementById('updateDetails').value;
    const caption = document.getElementById('updateCaption').value;
    const category = document.getElementById('updateCategory').value;

    const updatedCourseData = {
        title,
        description,
        details,
        caption,
        category
    };

    try {
        const response = await fetch(`/courses/${courseID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedCourseData)
        });

        if (response.ok) {
            loadCourses();
            closeUpdateCourseModal();
        } else {
            console.error('Error updating course:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating course:', error);
    }
}