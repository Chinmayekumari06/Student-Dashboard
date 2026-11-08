
// Backend API URL
const API_URL = "http://127.0.0.1:5000";


// Function to load dashboard statistics
async function loadDashboard() {

    try {

        // Send request to Flask backend
        const response = await fetch(
            `${API_URL}/api/stats`
        );

        // Check whether request was successful
        if (!response.ok) {
            throw new Error("Failed to fetch statistics");
        }

        // Convert JSON response into JavaScript object
        const data = await response.json();

        // Display values inside HTML elements
        document.getElementById("total").innerText =
            data.total_students;

        document.getElementById("math").innerText =
            data.average_math;

        document.getElementById("reading").innerText =
            data.average_reading;

        document.getElementById("writing").innerText =
            data.average_writing;

        console.log("Dashboard data loaded:", data);

    }

    catch (error) {

        console.error("Dashboard error:", error);

        document.getElementById("total").innerText =
            "Error";

        document.getElementById("math").innerText =
            "Error";

        document.getElementById("reading").innerText =
            "Error";

        document.getElementById("writing").innerText =
            "Error";

    }

}


// Call the function when page loads
loadDashboard();

let subjectChart;
let genderChart;

// CHART 1: Subject Performance

async function loadSubjectChart() {

    try {

        const response = await fetch(
            `${API_URL}/api/stats`
        );

        const data = await response.json();

        const ctx = document.getElementById(
            "subjectChart"
        );

        subjectChart = new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "Math",
                    "Reading",
                    "Writing"
                ],

                datasets: [{

                    label: "Average Score",

                    data: [
                        data.average_math,
                        data.average_reading,
                        data.average_writing
                    ],

                    backgroundColor: [
                        "#5271D8",
                        "#38A6A0",
                        "#E9A23B"
                    ],

                    borderRadius: 8

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: true,

                scales: {

                    y: {
                        beginAtZero: true,
                        max: 100
                    }

                }

            }

        });

    }

    catch (error) {

        console.error("Subject chart error:", error);

    }

}


// CHART 2: Gender Performance

async function loadGenderChart() {

    try {

        const response = await fetch(
            `${API_URL}/api/gender`
        );

        const data = await response.json();

        const ctx = document.getElementById(
            "genderChart"
        );

        genderChart = new Chart(ctx, {

            type: "bar",

            data: {

                labels: data.map(
                    student => student.gender
                ),

                datasets: [

                    {

                        label: "Math",

                        data: data.map(
                            student => student["math score"]
                        ),

                        backgroundColor: "#5271D8"

                    },

                    {

                        label: "Reading",

                        data: data.map(
                            student => student["reading score"]
                        ),

                        backgroundColor: "#38A6A0"

                    },

                    {

                        label: "Writing",

                        data: data.map(
                            student => student["writing score"]
                        ),

                        backgroundColor: "#E9A23B"

                    }

                ]

            },

            options: {

                responsive: true,

                scales: {

                    y: {
                        beginAtZero: true,
                        max: 100
                    }

                }

            }

        });

    }

    catch (error) {

        console.error("Gender chart error:", error);

    }

}


// Load all charts when webpage opens

loadSubjectChart();
loadGenderChart();
// FUNCTION TO LOAD STUDENT RECORDS
let allStudents = [];
let filteredStudents = [];
let currentPage = 1;
const rowsPerPage = 10;
// NEXT PAGE FUNCTION
function nextPage() {

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;

        displayStudents(filteredStudents);
    }
}
// previous PAGE FUNCTION
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayStudents(filteredStudents);
    }
}
// LOAD STUDENTS WHEN PAGE OPENS

async function loadStudents() {

    try {

        const response = await fetch(
            `${API_URL}/api/students`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch students");
        }

       allStudents = await response.json();
       filteredStudents = allStudents;
    displayStudents(filteredStudents);

    } catch (error) {

        console.error("Student error:", error);

        document.getElementById("studentTable").innerHTML =
            `<tr><td colspan="5">Unable to load records</td></tr>`;

    }

}


// DISPLAY STUDENTS


function displayStudents(students) {

    const tableBody = document.getElementById("studentTable");

    tableBody.innerHTML = "";

    // STEP 1: Calculate starting index
    const startIndex = (currentPage - 1) * rowsPerPage;

    // STEP 2: Calculate ending index
    const endIndex = startIndex + rowsPerPage;

    // STEP 3: Extract students for current page
    const paginatedStudents = students.slice(startIndex, endIndex);
    const totalPages = Math.ceil(students.length / rowsPerPage);

document.getElementById("pageInfo").textContent =
    `Page ${currentPage} of ${totalPages}`;
//disabling functions
document.getElementById("prevBtn").disabled = currentPage === 1;
document.getElementById("nextBtn").disabled = currentPage === totalPages;

    // STEP 4: Check whether students exist
    if (paginatedStudents.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="5">No students found</td></tr>`;
        return;
    }

    // STEP 5: Display students
    paginatedStudents.forEach(student => {

        const row = document.createElement("tr");

        const values = [
            student.gender,
            student["math score"],
            student["reading score"],
            student["writing score"],
            student["test preparation course"]
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        tableBody.appendChild(row);

    });

}

// SEARCH AND FILTER

function filterStudents() {

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const gender = document.getElementById("genderFilter")
        .value;

    const course = document.getElementById("courseFilter")
        .value;

    filteredStudents = allStudents.filter(student => {

        const matchesSearch = [
            student.gender,
            student["math score"],
            student["reading score"],
            student["writing score"],
            student["test preparation course"]
        ].some(value =>
            String(value).toLowerCase().includes(search)
        );

        const matchesGender =
            !gender || student.gender === gender;

        const matchesCourse =
            !course ||
            student["test preparation course"] === course;

        return matchesSearch && matchesGender && matchesCourse;

    });
    currentPage = 1;

    displayStudents(filteredStudents);

}


// EVENT LISTENERS

document.getElementById("searchInput")
    .addEventListener("input", filterStudents);

document.getElementById("genderFilter")
    .addEventListener("change", filterStudents);

document.getElementById("courseFilter")
    .addEventListener("change", filterStudents);
document.getElementById("nextBtn").addEventListener("click", nextPage);
document.getElementById("prevBtn").addEventListener("click", previousPage);
loadStudents();
