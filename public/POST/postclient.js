// Apply theme based on user preference
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

const postMessage = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    const response = await fetch(`/api/new_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "If you can see this POST is working :)" }),
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

const postEmployee = async (firstName, lastName, jobTitle, email, teamId) => {
  console.log('Sending employee data:', { firstName, lastName, jobTitle, email, teamId });

  try {
    const response = await fetch(`/api/new_employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        email: email,
        team_id: teamId
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const resultDiv = document.createElement('div');
    resultDiv.id = 'result';
    resultDiv.classList.add('result');
    resultDiv.textContent = "Employee added successfully";

    const addButton = document.querySelector('.add-button');
    const form = document.getElementById('employeeForm');
    form.insertBefore(resultDiv, addButton);

    return data;
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add employee: ' + error.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();

  const employeeForm = document.getElementById('employeeForm');
  if (employeeForm) {
    employeeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first_name').value;
      const lastName = document.getElementById('last_name').value;
      const jobTitle = document.getElementById('job_title').value;
      const email = document.getElementById('email').value;
      const teamId = document.getElementById('team').value;

      await postEmployee(firstName, lastName, jobTitle, email, teamId);
      employeeForm.reset();
    });
  }
});
