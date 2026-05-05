const express = require('express');
const app = express();
const port = 3000;
const tasksData = require('./task.json');

// Initialize tasks with createdAt and priority if missing
let tasks = tasksData.tasks.map((task, index) => ({
    ...task,
    createdAt: task.createdAt || new Date(Date.now() + index).toISOString(), // Unique dates for initial sorting
    priority: task.priority || 'medium'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /tasks: Retrieve all tasks with filtering and sorting
app.get('/tasks', (req, res) => {
    let filteredTasks = [...tasks];

    // Filtering by completion status
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        filteredTasks = filteredTasks.filter(t => t.completed === completed);
    }

    // Sorting by creation date (ascending - oldest first)
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json(filteredTasks);
});

// GET /tasks/priority/:level: Retrieve tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level.toLowerCase();
    const priorities = ['low', 'medium', 'high'];
    
    if (!priorities.includes(level)) {
        return res.status(400).send('Invalid priority level. Must be low, medium, or high.');
    }

    const filteredTasks = tasks.filter(t => t.priority === level);
    res.status(200).json(filteredTasks);
});

// GET /tasks/:id: Retrieve a specific task by its ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    
    // Validation
    if (title === undefined || description === undefined || completed === undefined) {
        return res.status(400).send('Missing required fields');
    }
    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).send('Title must be a non-empty string');
    }
    if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).send('Description must be a non-empty string');
    }
    if (typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }
    
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority ? priority.toLowerCase() : 'medium';
    if (!validPriorities.includes(taskPriority)) {
        return res.status(400).send('Priority must be low, medium, or high');
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority: taskPriority,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, completed, priority } = req.body;
    
    // Validation
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).send('Title must be a non-empty string');
    }
    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        return res.status(400).send('Description must be a non-empty string');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }
    
    if (priority !== undefined) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority.toLowerCase())) {
            return res.status(400).send('Priority must be low, medium, or high');
        }
    }

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title !== undefined ? title.trim() : tasks[taskIndex].title,
            description: description !== undefined ? description.trim() : tasks[taskIndex].description,
            completed: completed !== undefined ? completed : tasks[taskIndex].completed,
            priority: priority !== undefined ? priority.toLowerCase() : tasks[taskIndex].priority
        };
        res.status(200).json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

// DELETE /tasks/:id: Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(200).send('Task deleted');
    } else {
        res.status(404).send('Task not found');
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;