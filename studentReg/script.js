const studentForm = document.querySelector("#student-form");

const studentName = document.querySelector(".studentName");
const studentId = document.querySelector(".studentId");
const email = document.querySelector(".email");
const contact = document.querySelector(".contact");

const submitButton = document.querySelector(".btn");
const userTableBody = document.querySelector(".userTableBody");

const tableContainer = document.querySelector(".table-container");

// Get students from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Used to know whether we are editing a student
let editIndex = null;

// Display students when page loads
displayStudents();

// // Student name: allow only letters and spaces
studentName.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "");

});

// Student ID: allow only numbers
studentId.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

// Contact: allow only numbers
contact.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

// FORM SUBMIT
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addOrUpdateStudent();
});

// ADD OR UPDATE STUDENT
function addOrUpdateStudent() {
    // Get values
    const nameValue = studentName.value.trim();
    const idValue = studentId.value.trim();
    const emailValue = email.value.trim();
    const contactValue = contact.value.trim();

    // CHECK EMPTY FIELDS
    if (
        nameValue === "" ||
        idValue === "" ||
        emailValue === "" ||
        contactValue === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    // Minimum 10 digits
    if (contactValue.length < 10) {
        alert("Contact number must contain at least 10 digits.");
        return;
    }

    // CREATE STUDENT OBJECT
    const student = {name: nameValue, id: idValue, email: emailValue, contact: contactValue};
    // ADD NEW STUDENT
    if (editIndex === null) {
        students.push(student);
        alert("Student registered successfully.");
    }
    // UPDATE EXISTING STUDENT
    else {
        students[editIndex] = student;
        alert("Student updated successfully.");
        editIndex = null;
        submitButton.textContent = "Register";
    }
    // Save data
    saveStudents();

    // Display table
    displayStudents();

    // Clear form
    studentForm.reset();
}

// DISPLAY STUDENTS
function displayStudents() {
    // Remove old rows
    userTableBody.innerHTML = "";
    // Check whether students exist
    if (students.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.textContent = "No students registered.";
        emptyCell.colSpan = 5;
        emptyCell.classList.add("empty-message");
        emptyRow.appendChild(emptyCell);
        userTableBody.appendChild(emptyRow);
    }

    // Add each student
    students.forEach(function (student, index) {
        // Create row
        const row = document.createElement("tr");

        // NAME
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        // ID
        const idCell = document.createElement("td");
        idCell.textContent = student.id;

        // EMAIL
        const emailCell = document.createElement("td");
        emailCell.textContent = student.email;
        
        // CONTACT
        const contactCell = document.createElement("td");
        contactCell.textContent = student.contact;
        
        // ACTIONS
        const actionCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", function () {
            editStudent(index);
        });


        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function () {
            deleteStudent(index);
        });

        // Add buttons
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        
        // ADD CELLS TO ROW
        row.appendChild(nameCell);
        row.appendChild(idCell);
        row.appendChild(emailCell);
        row.appendChild(contactCell);
        row.appendChild(actionCell);

        // Add row to table
        userTableBody.appendChild(row);
    });

    // Update scrollbar
    updateScrollbar();
}

// EDIT STUDENT

function editStudent(index) {
    const student = students[index];
    // Put existing data into form
    studentName.value = student.name;
    studentId.value = student.id;
    email.value = student.email;
    contact.value = student.contact;

    // Remember which student we are editing
    editIndex = index;

    // Change button
    submitButton.textContent = "Update";

    // Scroll to form
    studentForm.scrollIntoView({
        behavior: "smooth"
    });

}

// DELETE STUDENT

function deleteStudent(index) {
    const student = students[index];
    const confirmation = confirm(
        `Are you sure you want to delete ${student.name}?`
    );
    if (!confirmation) {
        return;
    }

    // Delete student
    students.splice(index, 1);

    // Save updated data
    saveStudents();

    // Display updated table
    displayStudents();
}

// SAVE TO LOCAL STORAGE
function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

// DYNAMIC VERTICAL SCROLLBAR
function updateScrollbar() {
    const numberOfStudents = students.length;
    // If more than 6 students exist
    if (numberOfStudents > 6) {
        tableContainer.style.maxHeight = "350px";
        tableContainer.style.overflowY = "auto";
    }

    // If 6 or fewer students exist
    else {
        tableContainer.style.maxHeight = "none";
        tableContainer.style.overflowY = "hidden";
    }
}