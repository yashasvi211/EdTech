// server.js (Express Backend)

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware for parsing JSON requests

// Connect to MySQL
const db = mysql.createConnection({
  host: "ed-tech-anuj211358-a952.i.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_0vdtStG_pI8P_SCLS23",
  database: "defaultdb",
  port: 22278,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

// Sign-Up Route
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the email already exists
    const emailCheckQuery = "SELECT * FROM Users WHERE email = ?";
    db.query(emailCheckQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).send("Database Error");
      }

      if (results.length > 0) {
        return res.status(409).send("Email is already taken");
      }

      // If email does not exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, hashedPassword, role], (err) => {
        if (err) {
          return res.status(500).send("Database Error");
        }
        res.send("User registered successfully!");
      });
    });
  } catch (err) {
    res.status(500).send("An error occurred during sign-up");
  }
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).send("Database Error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid Email or Password");
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid Email or Password");
    }

    res.send({ id: user.id, name: user.name, role: user.role });
  });
});

// Fetch Tasks Route for a User
app.get("/tasks/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT tasks.id, tasks.task_name, tasks.deadline, IFNULL(user_tasks.completed, 0) AS completed
    FROM Tasks
    LEFT JOIN UserTasks AS user_tasks ON tasks.id = user_tasks.task_id AND user_tasks.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Server Error");
    }
    res.json(results);
  });
});

// Update Task Status Route
app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body; // Get the status (true or false) from the request body

  const sql = "UPDATE Tasks SET completed = ? WHERE id = ?";
  db.query(sql, [completed, taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task status updated successfully" });
  });
});
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ message: "Error fetching courses" });
    }
    res.json(results);
  });
});
app.get("/assignments/:courseId", (req, res) => {
  const { courseId } = req.params;

  const query = `SELECT * FROM assignments WHERE course_id = ?`;
  db.query(query, [courseId], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching assignments");
    }
    res.json(results);
  });
});

app.post("/submit-assignment", (req, res) => {
  const { assignment_id, student_id, file_link } = req.body;

  const query =
    "INSERT INTO assignment_submissions (assignment_id, student_id, file_link) VALUES (?, ?, ?)";
  db.query(query, [assignment_id, student_id, file_link], (err, results) => {
    if (err) {
      console.error("Database Error:", err); // Log the error
      return res
        .status(500)
        .json({ message: "Error submitting assignment", error: err });
    }
    res.json({ message: "Assignment submitted successfully" });
  });
});
app.get("/assignments/:courseId", (req, res) => {
  const { courseId } = req.params;
  const studentId = req.query.studentId; // Add student ID as a query parameter

  const query = `
    SELECT a.*, 
    CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END AS submitted
    FROM assignments a
    LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
    WHERE a.course_id = ?
  `;

  db.query(query, [studentId, courseId], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching assignments");
    }
    res.json(results);
  });
});

app.get("/assignment_submissions", (req, res) => {
  const query = `
    SELECT 
      a.id AS assignment_id,
      u.id AS student_id,
      COALESCE(asub.submitted_at, NULL) AS submitted_at
    FROM 
      assignments a
    CROSS JOIN 
      Users u
    LEFT JOIN 
      assignment_submissions asub 
    ON 
      a.id = asub.assignment_id AND u.id = asub.student_id
    WHERE 
      u.role = 'student'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching submission data:", err);
      return res.status(500).json({ message: "Error fetching submissions" });
    }
    res.json(results);
  });
});

// Server home route to explain endpoints
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Auth Server</h1><p>Use <b>/signup</b> to create an account, <b>/login</b> to log in, and <b>/tasks/:userId</b> to view tasks for a user.</p>"
  );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
