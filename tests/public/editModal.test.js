/**
 * @jest-environment jsdom
 */

// Mock localStorage for setup
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

describe('Employee Update Functionality', () => {
    // Setup the DOM
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="editEmployeeModal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <form id="editEmployeeForm">
            <input id="employeeId" type="hidden" value="123">
            <input id="editFirstName" type="text">
            <input id="editLastName" type="text">
            <input id="editJobTitle" type="text">
            <input id="editEmail" type="text">
            <input id="editSalary" type="number">
            <select id="editTeam">
              <option value="1">Team 1</option>
              <option value="2">Team 2</option>
              <option value="3">Team 3</option>
              <option value="4">Team 4</option>
            </select>
            <input id="editHireDate" type="date">
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    `;

        global.fetch.mockReset();
        window.getEmployees = jest.fn();

        window.alert = jest.fn();

        // Load the script to attach event listeners
        require('../../public/editModal.js');

        // Trigger DOMContentLoaded event
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    test('should submit form and update employee successfully', async () => {
        document.getElementById('employeeId').value = '123';
        document.getElementById('editFirstName').value = 'John';
        document.getElementById('editLastName').value = 'Doe';
        document.getElementById('editJobTitle').value = 'Senior Developer';
        document.getElementById('editEmail').value = 'john@example.com';
        document.getElementById('editSalary').value = '120000';
        document.getElementById('editTeam').value = '2';
        document.getElementById('editHireDate').value = '2022-01-15';

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: 123 })
        });

        const form = document.getElementById('editEmployeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        expect(fetch).toHaveBeenCalledWith('/api/employees/123', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String)
        });

        // Parse the request body to verify the data
        const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
        expect(requestBody).toEqual({
            id: '123',
            first_name: 'John',
            last_name: 'Doe',
            job_title: 'Senior Developer',
            email: 'john@example.com',
            salary: '120000',
            team_id: '2',
            hire_date: '2022-01-15'
        });

        // Check that getEmployees was called to refresh the list
        expect(window.getEmployees).toHaveBeenCalled();
    });

    test('should handle API error when updating employee', async () => {
        // Set up the form data
        document.getElementById('employeeId').value = '123';
        document.getElementById('editFirstName').value = 'John';
        document.getElementById('editLastName').value = 'Doe';

        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: jest.fn().mockResolvedValueOnce('Server Error')
        });

        const form = document.getElementById('editEmployeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        expect(fetch).toHaveBeenCalled();

        // Verify getEmployees was NOT called because of the error
        expect(window.getEmployees).not.toHaveBeenCalled();
    });

    test('should handle missing salary by setting it to null', async () => {
        // Set up form with missing salary
        document.getElementById('employeeId').value = '123';
        document.getElementById('editFirstName').value = 'John';
        document.getElementById('editLastName').value = 'Doe';
        document.getElementById('editJobTitle').value = 'Senior Developer';
        document.getElementById('editEmail').value = 'john@example.com';
        document.getElementById('editSalary').value = ''; // Empty salary
        document.getElementById('editTeam').value = '2';

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: 123 })
        });

        const form = document.getElementById('editEmployeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        // Parse the request body to verify null salary
        const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
        expect(requestBody.salary).toBeNull();
    });

    test('should handle missing hire date by setting it to null', async () => {
        // Set up form with missing hire date
        document.getElementById('employeeId').value = '123';
        document.getElementById('editFirstName').value = 'John';
        document.getElementById('editLastName').value = 'Doe';
        document.getElementById('editJobTitle').value = 'Senior Developer';
        document.getElementById('editEmail').value = 'john@example.com';
        document.getElementById('editSalary').value = '120000';
        document.getElementById('editTeam').value = '2';
        document.getElementById('editHireDate').value = ''; // Empty hire date

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ id: 123 })
        });

        const form = document.getElementById('editEmployeeForm');
        form.dispatchEvent(new Event('submit'));

        await new Promise(process.nextTick);

        // Parse the request body to verify null hire date
        const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
        expect(requestBody.hire_date).toBeNull();
    });
});
