let allEmployees = [];

const getEmployees = async (teamFilter = "All Teams", nameSearch = "") => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Fetching Employees...";

  try {
    if (allEmployees.length === 0) {
      const response = await fetch(`/api/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      allEmployees = await response.json();
    }

    let filteredEmployees = allEmployees;

    if (teamFilter !== "All Teams") {
      filteredEmployees = filteredEmployees.filter(
        employee => employee.team_name === teamFilter
      );
    }

    if (nameSearch.trim() !== "") {
      const searchTerm = nameSearch.toLowerCase().trim();
      filteredEmployees = filteredEmployees.filter(employee =>
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm)
      );
    }

    if (filteredEmployees.length === 0) {
      let message = "No employees found";
      if (teamFilter !== "All Teams") {
        message += ` in the ${teamFilter} team`;
      }
      if (nameSearch.trim() !== "") {
        message += ` with name containing "${nameSearch}"`;
      }
      resultElement.innerHTML = `<p>${message}.</p>`;
      return;
    }

    const employeeCards = filteredEmployees.map(employee => `
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
    allEmployees = allEmployees.filter(emp => emp.id !== id);

    alert('Employee deleted successfully');

    const teamSelect = document.getElementById("teams");
    const nameSearch = document.getElementById("nameSearch").value;
    await getEmployees(teamSelect.value, nameSearch);
  } catch (error) {
    console.error('Delete failed:', error);
    alert(`Failed to delete employee: ${error.message}`);
  }
};

const applyFilters = () => {
  const teamFilter = document.getElementById("teams").value;
  const nameSearch = document.getElementById("nameSearch").value;
  getEmployees(teamFilter, nameSearch);
};

document.getElementById("callFunction").addEventListener("click", () => {
  applyFilters();
});

document.getElementById("teams").addEventListener("change", () => {
  applyFilters();
});

// Event listener for the search input (search as you type)
document.getElementById("nameSearch").addEventListener("input", () => {
  applyFilters();
});
