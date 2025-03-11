document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('employeeModal');
    const addButton = document.querySelector('.add-button');
    const closeButton = document.querySelector('.close-modal');
    const form = document.getElementById('employeeForm');

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

    if (addButton) {
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeModal();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                job_title: document.getElementById('job_title').value,
                email: document.getElementById('email').value,
                salary: document.getElementById('salary').value,
                team_id: document.getElementById('team').value
            };

            try {
                const date = new Date();
                const formattedDate = date.toISOString().split('T')[0];

                const requestBody = {
                    ...formData,
                    salary: formData.salary || null,
                    hire_date: formattedDate
                };

                const response = await fetch(`/api/new_employee`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }

                await response.json();
                alert('Employee added successfully!');
                form.reset();
                closeModal();

                if (typeof window.getEmployees === 'function') {
                    window.getEmployees();
                } else {
                    window.location.reload();
                }
            } catch (error) {
                alert(`Failed to add employee: ${error.message}`);
            }
        });
    }
});
