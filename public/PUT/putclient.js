const getEmployeeIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

const loadEmployeeData = async (employeeId) => {
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
        console.error(error);
    }
};

const updateEmployee = async (event) => {
    event.preventDefault();
    const employeeId = getEmployeeIdFromUrl();

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

        const resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        resultDiv.classList.add('result');
        resultDiv.textContent = "Employee updated successfully";
        const updateButton = document.getElementById('submit');
        const form = document.getElementById('editEmployeeForm');
        form.insertBefore(resultDiv, updateButton);

    } catch (error) {
        console.error(`Error updating employee: ${error.message}`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const employeeId = getEmployeeIdFromUrl();
    if (employeeId) {
        loadEmployeeData(employeeId);
        document.getElementById('editEmployeeForm').addEventListener('submit', updateEmployee);
    }
});