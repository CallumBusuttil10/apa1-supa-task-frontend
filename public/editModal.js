document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('editEmployeeModal');
    const closeEditButton = document.querySelector('#editEmployeeModal .close-modal');
    const editForm = document.getElementById('editEmployeeForm');

    const teamMapping = {
        'Commercial': 1,
        'Front End Development': 2,
        'Back End Development': 3,
        'Recruitment': 4
    };

    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' ||
            (savedTheme !== 'light' &&
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    applyTheme();

    closeEditButton.addEventListener('click', () => {
        closeEditModal();
    });

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    function closeEditModal() {
        editModal.classList.remove('show');
        setTimeout(() => {
            editModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    window.showEditModal = async (employeeId) => {
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

            document.getElementById('employeeId').value = employee.id;
            document.getElementById('editFirstName').value = employee.first_name;
            document.getElementById('editLastName').value = employee.last_name;
            document.getElementById('editJobTitle').value = employee.job_title;
            document.getElementById('editEmail').value = employee.email;

            document.getElementById('editSalary').value = employee.salary || '';

            const teamSelect = document.getElementById('editTeam');
            if (employee.team_id) {
                teamSelect.value = employee.team_id;
            } else if (employee.team_name && teamMapping[employee.team_name]) {
                teamSelect.value = teamMapping[employee.team_name];
            }

            if (employee.hire_date) {
                const hireDate = new Date(employee.hire_date);
                const formattedDate = hireDate.toISOString().split('T')[0];
                document.getElementById('editHireDate').value = formattedDate;
            } else {
                document.getElementById('editHireDate').value = '';
            }

            editModal.style.display = 'flex';
            setTimeout(() => {
                editModal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error(`Error loading employee data: ${error.message}`);
            alert(`Failed to load employee data: ${error.message}`);
        }
    };

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const employeeId = document.getElementById('employeeId').value;
        const updatedEmployee = {
            id: employeeId,
            first_name: document.getElementById('editFirstName').value,
            last_name: document.getElementById('editLastName').value,
            job_title: document.getElementById('editJobTitle').value,
            email: document.getElementById('editEmail').value,
            team_id: document.getElementById('editTeam').value,
            salary: document.getElementById('editSalary').value || null,
            hire_date: document.getElementById('editHireDate').value || null
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
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            await response.json();

            alert('Employee updated successfully!');
            closeEditModal();

            if (typeof window.getEmployees === 'function') {
                window.getEmployees();
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error(`Error updating employee: ${error.message}`);
            alert(`Failed to update employee: ${error.message}`);
        }
    });
});
