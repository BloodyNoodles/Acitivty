const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  database: "task_management_system", // Change to your new database name
});

db.connect((err) => {
  if (err) {
    console.log("Database connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Get all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks"; // Fetch tasks
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { title, description, priority, due_date } = req.body;
  const sql =
    "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, description, priority, due_date], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ...req.body });
  });
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date } = req.body;
  const sql =
    "UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ? WHERE id = ?";
  db.query(sql, [title, description, priority, due_date, id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
