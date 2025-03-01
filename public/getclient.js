// Writing a function to communicate with our local server

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

    // Refresh the employee list after successful deletion
    await getEmployees();
  } catch (error) {
    console.error('Delete failed:', error);
    alert(`Failed to delete employee: ${error.message}`);
  }
};

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
    
    //  employee cards with both edit and delete buttons
    const employeeCards = data.map(employee => `
      <div class="employee-card">
        <h3>${employee.first_name} ${employee.last_name}</h3>
        <p>Job Title: ${employee.job_title}</p>
        <p>Email: ${employee.email}</p>
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

document.getElementById("callFunction").addEventListener("click", getEmployees);

// To begin try adding another button to use the postMessage function
