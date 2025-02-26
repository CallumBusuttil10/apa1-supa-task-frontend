// Writing a function to communicate with our local server

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
    resultElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
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

const postEmployee = async (firstName, lastName, jobTitle, email) => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    // Make sure to send the data dynamically from the form
    const response = await fetch(`/api/new_employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, job_title: jobTitle, email: email }),
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
