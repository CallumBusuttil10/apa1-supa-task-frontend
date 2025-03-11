# Employee Management System

## Project Overview
This Employee Management System is a **CRUD (Create, Read, Update, Delete)** web application that allows users to manage employee data. The application features a responsive interface with light/dark mode support, filtering and sorting capabilities, and an employee search function.

---

## Features

### CRUD Operations

#### 1. CREATE: Add New Employees
- Implemented in **`public/addModal.js`**
- Uses a modal form to collect employee data
- Sends **POST** requests to **`/api/new_employee`**

#### 2. READ: View and Filter Employees
- Implemented in **`public/getclient.js`**
- Displays employees in a responsive card format
- Supports filtering by team, name search, and sorting options
- Fetches data via **GET** requests to **`/api/employees`**

#### 3. UPDATE: Edit Existing Employees
- Implemented in **`public/editModal.js`**
- Pre-populates a modal form with employee data
- Submits changes via **PUT** requests to **`/api/employees/:id`**

#### 4. DELETE: Remove Employees
- Implemented in **`public/getclient.js`**
- Triggered by delete buttons on each employee card
- Sends **DELETE** requests to **`/api/employees/:id`**

---

## Additional Features
**Responsive Design**: Adapts to different screen sizes  
**Theme Support**: Toggle between light and dark mode  
**Advanced Filtering**: Filter employees by team and name search  
**Sorting Options**: Sort by name, salary (highest/lowest), or hire date (newest/oldest)  
**Error Handling**: Comprehensive error handling for all API operations  
**Responsive UI Feedback**: Feedback on how many employees are being displayed and event listeners to update the UI as the user searches.


---

## Technical Implementation

### Frontend Structure
- Vanilla **JavaScript** with modular design
- **DOM manipulation** for dynamic content updates
- **Event-driven architecture** for user interactions

### API Communication
- **Fetch API** for all HTTP requests
- **JSON** data format for API communication
- **RESTful** endpoint structure

### Data Management
- **Client-side filtering and sorting**
- **Caching** of employee data to minimize API calls
- **Form validation** and **data normalization**
---

## Challenges & Solutions

### 1. **Splitting CRUD Functions Across Different Pages**
**Challenge**: Initially, CRUD functions were split across different pages. While this worked at first, it became inefficient when refining the application, requiring extra effort to merge files and refactor the code.  
**Solution**: Consolidated all CRUD operations into a **single, modular structure** to improve maintainability and reduce redundancy.

### 2. **Limited CSS Knowledge & Research Time**
**Challenge**: Being unfamiliar with CSS meant extra time spent researching styles, layouts, and best practices.  
**Solution**: Invested time in learning **CSS fundamentals**, using Generative AI to highlight my errors and experimented with different styles to improve proficiency through **hands-on practice**.

### 3. **Limitations of Raw HTML & CSS vs. React**
**Challenge**: Using raw HTML and CSS instead of a library like React led to more manual DOM manipulation, which increased complexity.  
**Solution**: Learned a lot about **HTML and DOM elements**, but after discussions with teammates, realized that using **React could have streamlined development** and made state management easier.

---

## Testing

### Automated Testing
- **Jest** for automated testing
- **Unit tests** for all CRUD operations
- **Mocked API responses** for predictable testing

### Manual Testing
- **DevTools** for CSS tweaking and debugging
- **Console Logs** for functional testing visibility

### Running Tests
Run the test suite with:
```
npx jest tests/public/addModal.test.js
npx jest tests/public/editModal.test.js
npx jest tests/public/getclient.test.js