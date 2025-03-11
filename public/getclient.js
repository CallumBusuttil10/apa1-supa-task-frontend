let allEmployees = [];
const getEmployees = async (teamFilter = "All Teams", nameSearch = "", sortOption = "default") => {
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

    // Sort the employees based on the selected option
    if (sortOption === "alphabetical") {
      filteredEmployees.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "salaryHighest") {
      filteredEmployees.sort((a, b) => {
        // Convert salary strings to numbers for comparison
        const salaryA = parseFloat(a.salary || 0);
        const salaryB = parseFloat(b.salary || 0);
        return salaryB - salaryA; // Sort high to low
      });
    } else if (sortOption === "salaryLowest") {
      filteredEmployees.sort((a, b) => {
        // Convert salary strings to numbers for comparison
        const salaryA = parseFloat(a.salary || 0);
        const salaryB = parseFloat(b.salary || 0);
        return salaryA - salaryB; // Sort low to high
      });
    } else if (sortOption === "hireDate") {
      filteredEmployees.sort((a, b) => {
        // Convert hire_date strings to Date objects for comparison
        const dateA = new Date(a.hire_date || '1970-01-01');
        const dateB = new Date(b.hire_date || '1970-01-01');
        return dateB - dateA; // Sort newest to oldest
      });
    } else if (sortOption === "hireDateOldest") {
      filteredEmployees.sort((a, b) => {
        // Convert hire_date strings to Date objects for comparison
        const dateA = new Date(a.hire_date || '1970-01-01');
        const dateB = new Date(b.hire_date || '1970-01-01');
        return dateA - dateB; // Sort oldest to newest
      });
    }

    updateEmployeeCount(filteredEmployees.length, allEmployees.length);

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
        <p>Salary: £${employee.salary ? parseFloat(employee.salary).toLocaleString() : 'N/A'}</p>
        <p>Hired: ${employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('en-GB') : 'N/A'}</p>
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

const updateEmployeeCount = (shownCount, totalCount) => {
  const countElement = document.getElementById("employee-count");
  if (countElement) {
    countElement.textContent = `Showing ${shownCount} of ${totalCount} employees`;
    countElement.style.marginTop = "15px";
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
    const sortOption = document.getElementById("sortOption").value;
    await getEmployees(teamSelect.value, nameSearch, sortOption);
  } catch (error) {
    console.error('Delete failed:', error);
    alert(`Failed to delete employee: ${error.message}`);
  }
};

const applyFilters = () => {
  const teamFilter = document.getElementById("teams").value;
  const nameSearch = document.getElementById("nameSearch").value;
  const sortOption = document.getElementById("sortOption").value;
  getEmployees(teamFilter, nameSearch, sortOption);
};

const initThemeToggle = () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return; // Safety check

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeToggle.checked = false;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getEmployees();
  initThemeToggle();

  document.getElementById("teams").addEventListener("change", () => {
    applyFilters();
  });

  document.getElementById("nameSearch").addEventListener("input", () => {
    applyFilters();
  });

  document.getElementById("sortOption").addEventListener("change", () => {
    applyFilters();
  });
});
