const getEmployeeIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

const loadEmployeeData = async (employeeId) => {
    const resultElement = document.getElementById("result");

    try {
        const response = await fetch(`/api/employees/${employeeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const employee = await response.json();

        // Populate form fields
        document.getElementById('firstName').value = employee.first_name;
        document.getElementById('lastName').value = employee.last_name;
        document.getElementById('jobTitle').value = employee.job_title;
        document.getElementById('email').value = employee.email;

    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
};

const updateEmployee = async (event) => {
    event.preventDefault();
    const employeeId = getEmployeeIdFromUrl();
    const resultElement = document.getElementById("result");

    const updatedEmployee = {
        id: employeeId,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        job_title: document.getElementById('jobTitle').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch(`/api/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        resultElement.textContent = "Employee updated successfully";

    } catch (error) {
        resultElement.textContent = `Error updating employee: ${error.message}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const employeeId = getEmployeeIdFromUrl();
    if (employeeId) {
        loadEmployeeData(employeeId);
        document.getElementById('editEmployeeForm').addEventListener('submit', updateEmployee);
    }
});