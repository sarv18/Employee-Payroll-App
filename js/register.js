$(document).ready(function () {
    let toEditData = localStorage.getItem('editEmp');
    let employeeId = null;

    // Real-time Validation Functions
    const validateName = () => {
        const name = $('#emp-name').val();
        const nameRegex = /^[A-Z][a-zA-Z ]{3,}$/;
        if (!nameRegex.test(name)) {
            $('#nameError').text('Name should be correct').css('color', 'red');
            return false;
        } else {
            $('#nameError').text('');
            return true;
        }
    };

    const validateProfile = () => {
        if ($('input[name="profile"]:checked').length === 0) {
            $('#profileError').text('Please select a profile image').css('color', 'red');
            return false;
        } else {
            $('#profileError').text('');
            return true;
        }
    };

    const validateGender = () => {
        if ($('input[name="gender"]:checked').length === 0) {
            $('#genderError').text('Please select your gender').css('color', 'red');
            return false;
        } else {
            $('#genderError').text('');
            return true;
        }
    };

    const validateDepartment = () => {
        if ($('input[type="checkbox"]:checked').length === 0) {
            $('#departmentError').text('Please select at least one department').css('color', 'red');
            return false;
        } else {
            $('#departmentError').text('');
            return true;
        }
    };

    const validateSalary = () => {
        if ($('#salary').val() === null) {
            $('#salaryError').text('Please choose a salary option').css('color', 'red');
            return false;
        } else {
            $('#salaryError').text('');
            return true;
        }
    };

    const validateDate = () => {
        const day = parseInt($('#day').val());
        const month = parseInt($('#month').val()) - 1;
        const year = parseInt($('#year').val());
        const selectedDate = new Date(year, month, day);
        const today = new Date();

        if (isNaN(day) || isNaN(month) || isNaN(year) || day <= 0 || month < 0 || year <= 0) {
            $('#dateError').text('Please select a valid start date').css('color', 'red');
            return false;
        } else if (selectedDate > today) {
            $('#dateError').text('Date cannot be in the future').css('color', 'red');
            return false;
        } else {
            $('#dateError').text('');
            return true;
        }
    };

    const validateNotes = () => {
        const notes = $('#notes').val();
        if (notes.length > 200) {
            $('#notesError').text('Notes should not exceed 100 characters').css('color', 'red');
            return false;
        } else {
            $('#notesError').text('');
            return true;
        }
    };

    // Add real-time validation event listeners
    $('#emp-name').on('input', validateName);
    $('input[name="profile"]').on('change', validateProfile);
    $('input[name="gender"]').on('change', validateGender);
    $('input[type="checkbox"]').on('change', validateDepartment);
    $('#salary').on('change', validateSalary);
    $('#day, #month, #year').on('change', validateDate);
    $('#notes').on('input', validateNotes);

    // Overall form validation
    const validateForm = () => {
        const isNameValid = validateName();
        const isProfileValid = validateProfile();
        const isGenderValid = validateGender();
        const isDepartmentValid = validateDepartment();
        const isSalaryValid = validateSalary();
        const isDateValid = validateDate();
        const isNotesValid = validateNotes();

        return (
            isNameValid &&
            isProfileValid &&
            isGenderValid &&
            isDepartmentValid &&
            isSalaryValid &&
            isDateValid &&
            isNotesValid
        );
    };

  // Pre-fill form data if editing
    if (toEditData) {
        toEditData = JSON.parse(toEditData);
        employeeId = toEditData.id; // Store the employee ID for PUT request

        // Populate the form with existing employee data
        $('#emp-name').val(toEditData.name);
        $(`input[name="profile"][value="${toEditData.profile}"]`).prop('checked', true);
        $(`input[name="gender"][value="${toEditData.gender}"]`).prop('checked', true);

        // Check the relevant department checkboxes
        if (toEditData.department && Array.isArray(toEditData.department)) {
            toEditData.department.forEach(dept => {
                $(`input[type="checkbox"][value="${dept}"]`).prop('checked', true);
            });
        }

        $('#salary').val(toEditData.salary);
        $('#day').val(toEditData.startDate?.day);
        $('#month').val(toEditData.startDate?.month);
        $('#year').val(toEditData.startDate?.year);
        $('#notes').val(toEditData.notes);
    }

    // Handle form submission for adding/updating employee
    $('#emp-form').on('submit', function (event) {
        event.preventDefault(); // Prevent page refresh

        if (!validateForm()) {
            return; // Do not proceed if validation fails
        }

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

        // Determine whether to use POST or PUT based on `employeeId`
        const method = employeeId ? 'PUT' : 'POST';
        const url = employeeId ? `http://localhost:3000/employees/${employeeId}` : 'http://localhost:3000/employees';

        // Send a request to JSON Server to save/update data
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (response.ok) {
                console.log(employeeId ? "Employee updated successfully" : "Employee added successfully");
                localStorage.removeItem('editEmp'); // Clear edit data after saving
                window.location.href = './dashboard.html'; // Redirect to dashboard
            } else {
                console.error("Failed to save employee data");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Reset button functionality
    $('.resetButton').on('click', function () {
        $('#emp-form')[0].reset();
        console.log("Form has been reset");
    });

    // Cancel button functionality
    $('.cancelButton').on('click', function (event) {
        event.preventDefault();
        localStorage.removeItem('editEmp'); // Clear edit data on cancel
        window.location.href = './dashboard.html';
    });
});
