document.addEventListener("DOMContentLoaded", () => {
    const employeeTableBody = document.getElementById("employeeTableBody");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Fetch employee data from JSON server and populate the table
    fetchEmployees();

    // Search button click event listener
    searchButton.addEventListener("click", () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        fetchEmployees(searchQuery);
    });

    const getDepartmentHtml = (departmentList) => {
        let departmentHtml = "";
        for (let department of departmentList) {
            departmentHtml = `${departmentHtml} <div class="dept-label">${department}</div>`;
        }
        return departmentHtml;
    }

    // Function to fetch employees with optional search query
    function fetchEmployees(searchQuery = "") {
        fetch('http://localhost:3000/employees')
            .then(response => response.json())
            .then(employees => {
                // If there's a search query, filter employees by name
                if (searchQuery) {
                    employees = employees.filter(employee => 
                        employee.name && employee.name.toLowerCase().includes(searchQuery)
                    );
                }
                
                populateTable(employees);
            })
            .catch(error => console.error("Error fetching employees:", error));
        }

    // Function to populate the employee table
    function populateTable(employees) {
        employeeTableBody.innerHTML = ""; // Clear existing rows

        if (employees.length > 0) {
            employees.forEach(employee => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td><img src="${employee.profile}" alt="Profile" class="profile-pic"></td>
                    <td>${employee.name || "N/A"}</td>
                    <td>${employee.gender || "N/A"}</td>
                    <td>${getDepartmentHtml(employee.department)}</td>
                    <td>${employee.salary || "N/A"}</td>
                    <td>${employee.startDate ? `${employee.startDate.day}-${employee.startDate.month}-${employee.startDate.year}` : "N/A"}</td>
                    <td>
                        <button class="edit-btn" id="edit-${employee.id}" title="Edit">
                            <img src="../assets/icons8-edit-24.png" alt="Edit" class="icon">
                        </button>
                        <button class="delete-btn" id="del-${employee.id}" title="Delete">
                            <img src="../assets/icons8-delete-30.png" alt="Delete" class="icon">
                        </button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
                addEventListeners(employee.id);
            });
        } else {
            // If no employees match the search, show 'No records found'
            const noRecordsRow = document.createElement("tr");
            noRecordsRow.innerHTML = `<td colspan="7" style="text-align:center;">No records found</td>`;
            employeeTableBody.appendChild(noRecordsRow);
        }
    }
    
    function addEventListeners(id) {
        document.getElementById(`edit-${id}`).addEventListener('click', ()=> {
            // Fetch the current employee data by ID
            fetch(`http://localhost:3000/employees/${id}`)
            .then(response => response.json())
            .then(employee => {
                // Store employee data in localStorage for editing
                localStorage.setItem('editEmp', JSON.stringify(employee));
                // Navigate to the registration/edit page
                window.location.href = "../pages/register.html";
            })
            .catch(error => console.error("Error fetching employee data:", error));
        })

        document.getElementById(`del-${id}`).addEventListener('click', ()=> {
            const confirmDelete = confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            fetch(`http://localhost:3000/employees/${id}`, 
                { method: 'DELETE' })
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
    }

    // Trigger search on pressing Enter
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
});
