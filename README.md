# Task Manager API

A robust RESTful API built with Node.js and Express for managing tasks. This project supports full CRUD operations, input validation, filtering, sorting, and priority levels, using in-memory storage.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks.
- **In-Memory Storage**: Initialized with data from `task.json`.
- **Advanced Filtering**: Filter tasks by completion status.
- **Sorting**: Tasks are sorted by creation date.
- **Priority Levels**: Support for `low`, `medium`, and `high` priority.
- **Robust Validation**: Ensures all inputs are valid and descriptive errors are returned.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository or extract the project files.
2. Navigate to the project directory:
   ```bash
   cd task-manager-api-nikhil-reddy-kothakappu
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Server
To start the API server on `http://localhost:3000`:
```bash
node app.js
```

### Running Tests
To run the automated test suite:
```bash
npm test
```

## API Documentation

### Endpoints

| Method | Endpoint | Description | Query Params / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieve all tasks | `completed=true/false` (optional) |
| **GET** | `/tasks/:id` | Retrieve a specific task by ID | None |
| **GET** | `/tasks/priority/:level` | Retrieve tasks by priority | `:level` can be `low`, `medium`, or `high` |
| **POST** | `/tasks` | Create a new task | `{ "title", "description", "completed", "priority" }` |
| **PUT** | `/tasks/:id` | Update an existing task | `{ "title", "description", "completed", "priority" }` |
| **DELETE** | `/tasks/:id` | Delete a task by ID | None |

### Data Schema
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false,
  "priority": "medium",
  "createdAt": "2026-05-05T17:55:24.000Z"
}
```

### How to Test

#### Using `curl`

- **Create a Task**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"title":"Learn Express","description":"Master the basics","completed":false,"priority":"high"}' http://localhost:3000/tasks
  ```

- **Get All Tasks**:
  ```bash
  curl http://localhost:3000/tasks
  ```

- **Filter by Completed**:
  ```bash
  curl http://localhost:3000/tasks?completed=true
  ```

- **Update a Task**:
  ```bash
  curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/tasks/1
  ```

- **Delete a Task**:
  ```bash
  curl -X DELETE http://localhost:3000/tasks/1
  ```

#### Using Postman
1. Create a new request in Postman.
2. Select the HTTP method and enter the URL (e.g., `http://localhost:3000/tasks`).
3. For `POST` and `PUT`, go to the **Body** tab, select **raw**, and set the type to **JSON**. Paste your task data there.
