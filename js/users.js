$(document).ready(function () {
    // Handle form submission
    $('#emp-form').on('submit', function (event) {
        event.preventDefault(); // Prevent page refresh

        // Capture form data
        const employeeData = {
            name: $('#emp-name').val(),
            profile: $('input[name="profile"]:checked').val(),
            gender: $('input[name="gender"]:checked').val(),
            department: $('input[type="checkbox"]:checked').map(function () { return this.value; }).get(),
            salary: $('#salary').val(),
            startDate: {
                day: $('#day').val(),
                month: $('#month').val(),
                year: $('#year').val()
            },
            notes: $('#notes').val()
        };
        
        // Send a POST request to JSON Server to save data
        fetch('http://localhost:3000/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (response.ok) {
                console.log("Employee data saved to db.json");
                // window.location.href = './dashboard.html';
            } else {
                console.error("Failed to save employee data");
            }
        })
        .catch(error => console.error("Error:", error));

        // Get existing employees from localStorage
        let employees = JSON.parse(localStorage.getItem("employeeData")) || [];

        // Add the new employee to the array
        employees.push(employeeData);

        // Save updated employee data
        localStorage.setItem("employeeData", JSON.stringify(employees));

        console.log("Employee Data Saved in Local Storage:", employeeData);

    });

    // Reset button functionality
    $('.resetButton').on('click', function () {
        $('#emp-form')[0].reset();
        console.log("Form has been reset");
    });

    // Cancel button functionality
    $('.cancelButton').on('click', function (event) {
        event.preventDefault();
        window.location.href = './dashboard.html';
    });

});
