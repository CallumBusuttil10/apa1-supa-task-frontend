/**
 * @jest-environment jsdom
 */

// Mock localStorage for test setup
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch API
global.fetch = jest.fn();

describe('Employee Creation Functionality', () => {
    // Setup the DOM
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="employeeModal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <form id="employeeForm">
            <input id="first_name" type="text">
            <input id="last_name" type="text">
            <input id="job_title" type="text">
            <input id="email" type="text">
            <input id="salary" type="number">
            <select id="team">
              <option value="1">Team 1</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    `;

        // Reset mocks for each test
        global.fetch.mockReset();
        window.getEmployees = jest.fn();

        window.alert = jest.fn();

        // Load the script to attach event listeners
        require('../../public/addModal.js');

        // Trigger DOMContentLoaded event
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    test('should submit form and add employee successfully', async () => {
        document.getElementById('first_name').value = 'John';
        document.getElementById('last_name').value = 'Doe';
        document.getElementById('job_title').value = 'Developer';
        document.getElementById('email').value = 'john@example.com';
        document.getElementById('salary').value = '100000';
        document.getElementById('team').value = '1';

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: 1 })
        });

        const form = document.getElementById('employeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        expect(fetch).toHaveBeenCalledWith('/api/new_employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String)
        });

        // Parse the request body to verify the data
        const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
        expect(requestBody).toEqual({
            first_name: 'John',
            last_name: 'Doe',
            job_title: 'Developer',
            email: 'john@example.com',
            salary: '100000',
            team_id: '1',
            hire_date: expect.any(String)
        });

        expect(window.getEmployees).toHaveBeenCalled();

    });

    test('should handle API error when adding employee', async () => {
        // Set up the form data
        document.getElementById('first_name').value = 'John';
        document.getElementById('last_name').value = 'Doe';

        // Mock failed fetch response
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: jest.fn().mockResolvedValueOnce('Server Error')
        });

        const form = document.getElementById('employeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        expect(fetch).toHaveBeenCalled();

        // Verify getEmployees was NOT called because of the error
        expect(window.getEmployees).not.toHaveBeenCalled();
    });

    test('should handle missing salary by setting it to null', async () => {
        // Set up form with missing salary
        document.getElementById('first_name').value = 'John';
        document.getElementById('last_name').value = 'Doe';
        document.getElementById('job_title').value = 'Developer';
        document.getElementById('email').value = 'john@example.com';
        document.getElementById('salary').value = ''; // Empty salary
        document.getElementById('team').value = '1';

        // Mock successful fetch response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: 1 })
        });

        const form = document.getElementById('employeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        // Parse the request body to verify null salary
        const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
        expect(requestBody.salary).toBeNull();
    });
});
