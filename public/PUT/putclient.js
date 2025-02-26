const urlParams = new URLSearchParams(window.location.search);
        const employeeId = urlParams.get('id');
        document.getElementById('employeeId').value = employeeId;

        document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                id: employeeId,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                jobTitle: document.getElementById('jobTitle').value,
                email: document.getElementById('email').value
            };
            
            await updateEmployee(
                formData.id,
                formData.firstName,
                formData.lastName,
                formData.jobTitle,
                formData.email
            );
        });
        
        async function fetchEmployeeDetails(id) {
            try {
                const response = await fetch(`/api/employees`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                const employee = data.find(emp => emp.id === parseInt(id));
                
                document.getElementById('firstName').value = employee.first_name;
                document.getElementById('lastName').value = employee.last_name;
                document.getElementById('jobTitle').value = employee.job_title;
                document.getElementById('email').value = employee.email;
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const employeeId = urlParams.get('id');
            document.getElementById('employeeId').value = employeeId;
            fetchEmployeeDetails(employeeId);
        });

        document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                id: document.getElementById('employeeId').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                jobTitle: document.getElementById('jobTitle').value,
                email: document.getElementById('email').value
            };
            
            await updateEmployee(
                formData.id,
                formData.firstName,
                formData.lastName,
                formData.jobTitle,
                formData.email
            );
        });

        const updateEmployee = async (id, firstName, lastName, jobTitle, email) => {
            const resultElement = document.getElementById("result");
            resultElement.textContent = "Updating Employee...";
          
            try {
              const response = await fetch(`/api/employees`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: id,
                  first_name: firstName,
                  last_name: lastName,
                  job_title: jobTitle,
                  email: email
                }),
              });
          
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
          
              const data = await response.json();
              resultElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
              resultElement.textContent = `Error: ${error.message}`;
            }
          };