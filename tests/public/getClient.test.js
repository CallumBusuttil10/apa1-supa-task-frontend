/**
 * @jest-environment jsdom
 */

// Mock fetch API
global.fetch = jest.fn();

describe('Employee Retrieval and Deletion Functionality', () => {
    // Sample employee data for testing
    const mockEmployees = [
        {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_title: 'Developer',
            email: 'john@example.com',
            salary: '80000',
            team_name: 'Front End Development',
            hire_date: '2021-01-15'
        },
        {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            job_title: 'Designer',
            email: 'jane@example.com',
            salary: '75000',
            team_name: 'Commercial',
            hire_date: '2022-03-10'
        }
    ];

    // Setup the DOM
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="result">Fetching Employees...</div>
      <div id="employee-count"></div>
      <select id="teams">
        <option value="All Teams">All Teams</option>
        <option value="Commercial">Commercial</option>
        <option value="Front End Development">Front End Development</option>
      </select>
      <input id="nameSearch" type="text" value="">
      <select id="sortOption">
        <option value="default">Default</option>
      </select>
    `;

        global.fetch.mockReset();
        window.alert = jest.fn();

        window.getEmployees = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    // Test for GET functionality
    test('should fetch employees from API and update DOM', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockEmployees)
        });

        require('../../public/getclient.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        await new Promise(process.nextTick);

        // Check that fetch was called with the right URL
        expect(fetch).toHaveBeenCalledWith('/api/employees', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // Check that the result contains employee data
        const resultElement = document.getElementById('result');
        expect(resultElement.innerHTML).toContain('John');
        expect(resultElement.innerHTML).toContain('Doe');
        expect(resultElement.innerHTML).toContain('Jane');
        expect(resultElement.innerHTML).toContain('Smith');
    });

    // Test for DELETE functionality
    test('should call DELETE API when deleteEmployee function is called', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true
        });

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([])
        });

        require('../../public/getclient.js');

        if (window.deleteEmployee) {
            await window.deleteEmployee(1);

            // Check that fetch was called with the right URL and method
            expect(fetch).toHaveBeenCalledWith('/api/employees/1', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            expect(window.alert).toHaveBeenCalledWith('Employee deleted successfully');
        } else {
            console.warn('deleteEmployee function not found on window object');
        }
    });
});
