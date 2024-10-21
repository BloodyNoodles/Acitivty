const express = require("express");
const mysql = require("mysql2/promise");  // Use mysql2/promise for async/await
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool using mysql2/promise
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  database: "task_management_system",
});

// Middleware to check admin role
const checkAdmin = (req, res, next) => {
    const { role } = req.user; // Assuming req.user is populated after authentication
    if (role === 'admin') {
        next(); // Proceed to the next middleware/route handler
    } else {
        res.status(403).send('Access denied'); // Forbidden response
    }
};

// User registration endpoint
app.post("/api/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Validate the role
        if (role && role !== 'admin' && role !== 'user') {
            return res.status(400).send('Invalid role');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the user into the database
        await db.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, role || 'user']);
        
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Server error');
    }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        if (await bcrypt.compare(password, user.password)) {
            // Store user info in session (or token) after successful login
            req.user = { id: user.id, role: user.role };
            req.session.user = { id: user.id, role: user.role }; // Assuming session-based login
            res.json({ id: user.id, role: user.role });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Example protected route for admin users
app.get("/api/admin", checkAdmin, (req, res) => {
    res.send("Welcome, admin!");
});

// Get user role endpoint
app.get('/api/getUserRole', async (req, res) => {
    try {
        // Here, you can get the user from req.user if you use sessions or a token
        // For example, if the user is authenticated and you have user info in req.user
        // Assuming you're storing the user role after login in a session or token
        
        // Example if using sessions:
        if (req.user) {
            const { role } = req.user;
            return res.json({ role });
        }
        
        // If no user is logged in
        res.status(401).json({ message: 'Not authenticated' });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const [tasks] = await db.execute("SELECT * FROM tasks"); // Fetch tasks
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Server error");
    }
});

// Add a new task
app.post("/tasks", async (req, res) => {
    const { title, description, priority, due_date } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)",
            [title, description, priority, due_date]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).send("Server error");
    }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, due_date } = req.body;
    try {
        const [result] = await db.execute(
            "UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ? WHERE id = ?",
            [title, description, priority, due_date, id]
        );
        res.json(result);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("Server error");
    }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
        res.json(result);
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("Server error");
    }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
