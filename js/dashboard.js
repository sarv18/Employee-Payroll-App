document.addEventListener("DOMContentLoaded", () => {
    const employeeTableBody = document.getElementById("employeeTableBody");
    const empForm = document.getElementById("emp-form");

    // // Ensure that the table body and form exist
    // if (!employeeTableBody) {
    //     console.error("Element with ID 'employeeTableBody' not found");
    //     return;
    // }
    // if (!empForm) {
    //     console.error("Element with ID 'emp-form' not found");
    //     return;
    // }

    // Fetch employee data from JSON server and populate the table
    fetchEmployees();

    function fetchEmployees() {
        fetch('http://localhost:3000/employees')
            .then(response => response.json())
            .then(employees => populateTable(employees))
            .catch(error => console.error("Error fetching employees:", error));
    }

    function editEmployee(id) {
        console.log(id)
    }

    function populateTable(employees) {
        employeeTableBody.innerHTML = ""; // Clear existing rows

        employees.forEach(employee => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${employee.name || "N/A"}</td>
                <td>${employee.gender || "N/A"}</td>
                <td>${(employee.department || []).join(", ")}</td>
                <td>${employee.salary || "N/A"}</td>
                <td>${employee.startDate ? `${employee.startDate.day}-${employee.startDate.month}-${employee.startDate.year}` : "N/A"}</td>
                <td>
                    <button class="edit-btn" id="${employee.id}" onclick="${()=>editEmployee(employee.id)}" title="Edit">
                        <img src="../assets/icons8-edit-24.png" alt="Edit" class="icon">
                    </button>
                    <button class="delete-btn" data-id="${employee.id}" title="Delete">
                        <img src="../assets/icons8-delete-30.png" alt="Delete" class="icon">
                    </button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });

        // addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    }

    // Handle editing the employee
    function handleEdit(event) {
        const button = event.target.closest(".edit-btn");
        const employeeId = button?.getAttribute("data-id");
    
        // if (!employeeId) {
        //     console.error("Employee ID not found");
        //     return;
        // }
    
        // Fetch the employee data by ID and prefill the form
        fetch(`http://localhost:3000/employees/${employeeId}`)
            .then(response => response.json())
            .then(employee => {
                if (!employee) {
                    console.error("No employee data found");
                    return;
                }
    
                // Prefill form fields with employee data
                const empNameField = document.getElementById('emp-name');
                if (empNameField) empNameField.value = employee.name || '';
    
                const profileRadio = document.querySelector(`input[name="profile"][value="${employee.profile}"]`);
                if (profileRadio) profileRadio.checked = true;
    
                const genderRadio = document.querySelector(`input[name="gender"][value="${employee.gender}"]`);
                if (genderRadio) genderRadio.checked = true;
    
                // Prefill checkboxes for departments
                const departmentCheckboxes = document.querySelectorAll('input[type="checkbox"]');
                departmentCheckboxes.forEach(checkbox => {
                    checkbox.checked = employee.department?.includes(checkbox.value) || false;
                });
    
                const salaryField = document.getElementById('salary');
                if (salaryField) salaryField.value = employee.salary || '';
    
                const dayField = document.getElementById('day');
                if (dayField) dayField.value = employee.startDate?.day || '';
    
                const monthField = document.getElementById('month');
                if (monthField) monthField.value = employee.startDate?.month || '';
    
                const yearField = document.getElementById('year');
                if (yearField) yearField.value = employee.startDate?.year || '';
    
                const notesField = document.getElementById('notes');
                if (notesField) notesField.value = employee.notes || '';
    
                const employeeIdField = document.getElementById('employeeId');
                if (employeeIdField) employeeIdField.value = employee.id || '';
            })
    
            .catch(error => console.error("Error fetching employee details:", error));
    }
    

    // Handle form submission for editing an existing employee
    // // empForm.addEventListener('submit', function (event) {
    //     event.preventDefault();

    //     const employeeId = document.getElementById('employeeId').value;
    //     const updatedEmployee = {
    //         name: document.getElementById('emp-name')?.value,
    //         profile: document.querySelector('input[name="profile"]:checked')?.value,
    //         gender: document.querySelector('input[name="gender"]:checked')?.value,
    //         department: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value),
    //         salary: document.getElementById('salary')?.value,
    //         startDate: {
    //             day: document.getElementById('day')?.value,
    //             month: document.getElementById('month')?.value,
    //             year: document.getElementById('year')?.value
    //         },
    //         notes: document.getElementById('notes')?.value
    //     };

    //     // If employee ID is present, update the existing record
    //     if (employeeId) {
    //         fetch(`http://localhost:3000/employees/${employeeId}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(updatedEmployee)
    //         })
    //             .then(response => {
    //                 if (response.ok) {
    //                     console.log("Employee updated successfully");
    //                     fetchEmployees(); // Refresh the table
    //                     clearForm();
    //                 } else {
    //                     console.error("Failed to update employee");
    //                 }
    //             })
    //             .catch(error => console.error("Error updating employee:", error));
    //     }
    // });

    // Clear form after submission or edit
    function clearForm() {
        empForm.reset();
        document.getElementById('employeeId').value = ""; // Clear the hidden ID field
    }

    // Handle deleting an employee
    function handleDelete(event) {
        const button = event.target.closest(".delete-btn");
        const employeeId = button?.getAttribute("data-id");

        if (!employeeId) {
            console.error("Employee ID not found for deletion");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this employee?");
        if (!confirmDelete) return;

        fetch(`http://localhost:3000/employees/${employeeId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    console.log("Employee deleted successfully");
                    fetchEmployees(); // Refresh the table
                } else {
                    console.error("Failed to delete employee");
                }
            })
            .catch(error => console.error("Error deleting employee:", error));
    }
});
