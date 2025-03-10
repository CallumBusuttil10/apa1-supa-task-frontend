const getEmployees = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Fetching Employees...";

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
    const employeeCards = data.map(employee => `
      <div class="employee-card">
        <h3>${employee.first_name} ${employee.last_name}</h3>
        <p>${employee.job_title}</p>
        <p>${employee.email}</p>
        <p style="font-weight: bold">Team: ${employee.team_name || 'Not Assigned'}</p>
        <div class="button-container">
          <a href="/PUT/editEmployees.html?id=${employee.id}" class="edit-link">
            <button class="edit-button">Edit</button>
          </a>
          <button class="delete-button" onclick="deleteEmployee(${employee.id})">Delete</button>
        </div>
      </div>
    `).join('');

    resultElement.innerHTML = employeeCards;
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    alert('Employee deleted successfully');
    await getEmployees();
  } catch (error) {
    console.error('Delete failed:', error);
    alert(`Failed to delete employee: ${error.message}`);
  }
};

document.getElementById("callFunction").addEventListener("click", getEmployees);




//Josh's Example REMOVE BEFORE SUBMITTING
const getMessages = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    const response = await fetch(`/api/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

