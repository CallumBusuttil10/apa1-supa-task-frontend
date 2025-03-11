const getEmployeeIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// Map team names to IDs for lookup
const teamMapping = {
    'Commercial': 1,
    'Front End Development': 2,
    'Back End Development': 3
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

        document.getElementById('firstName').value = employee.first_name;
        document.getElementById('lastName').value = employee.last_name;
        document.getElementById('jobTitle').value = employee.job_title;
        document.getElementById('email').value = employee.email;

        const teamSelect = document.getElementById('team');
        if (employee.team_id) {
            teamSelect.value = employee.team_id;
        } else if (employee.team_name && teamMapping[employee.team_name]) {
            teamSelect.value = teamMapping[employee.team_name];
        }

    } catch (error) {
        console.error(error);
    }
};

const updateEmployee = async (event) => {
    event.preventDefault();
    const employeeId = getEmployeeIdFromUrl();

    const teamId = document.getElementById('team').value;

    const updatedEmployee = {
        id: employeeId,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        job_title: document.getElementById('jobTitle').value,
        email: document.getElementById('email').value,
        team_id: teamId
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