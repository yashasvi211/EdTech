const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

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
  console.log("Sign-Up Request Received");
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the email already exists
    const emailCheckQuery = "SELECT * FROM Users WHERE email = ?";
    db.query(emailCheckQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database Error during email check:", err);
        return res.status(500).send("Database Error");
      }

      if (results.length > 0) {
        console.log("Email already exists:", email);
        return res.status(409).send("Email is already taken");
      }

      // If email does not exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, hashedPassword, role], (err) => {
        if (err) {
          console.error("Database Error during user registration:", err);
          return res.status(500).send("Database Error");
        }
        res.send("User registered successfully!");
      });
    });
  } catch (err) {
    console.error("Error in Sign-Up:", err);
    res.status(500).send("An error occurred during sign-up");
  }
});

// Login Route
app.post("/login", (req, res) => {
  console.log("Login Request Received");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  const sql = "SELECT * FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database Error during login:", err);
      return res.status(500).send("Database Error");
    }

    if (results.length === 0) {
      console.log("No user found with email:", email);
      return res.status(401).send("Invalid Email or Password");
    }

    const user = results[0];
    console.log("User found:", {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).send("Invalid Email or Password");
    }

    console.log("Login successful for user:", {
      id: user.id,
      name: user.name,
      role: user.role,
    });
    res.send({ id: user.id, name: user.name, role: user.role });
  });
});

// Fetch Tasks Route for a User
app.get("/tasks/:userId", (req, res) => {
  const { userId } = req.params;

  // Query to fetch tasks for the user
  const sql = "SELECT * FROM tasks WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database Error during task fetch:", err);
      return res.status(500).send("Database Error");
    }

    if (results.length === 0) {
      return res.status(404).send("No tasks found for this user");
    }

    // Return the list of tasks for the user
    res.json(results);
  });
});

// Update Task Status Route
// Fetch all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Error while fetching tasks:", err);
      return res.status(500).json({ error: "Database Error" }); // Ensure the response is JSON
    }
    res.json(results); // This sends the tasks in JSON format
  });
});
// Update Task Status Route
app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body; // Get the status (true or false) from the request body

  const sql = "UPDATE tasks SET completed = ? WHERE id = ?";
  db.query(sql, [completed, taskId], (err, results) => {
    if (err) {
      console.error("Database Error while updating task:", err);
      return res.status(500).json({ error: "Database Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    res.json({ message: "Task status updated successfully" });
  });
});

// Server home route to explain endpoints
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Auth Server</h1><p>Use <b>/signup</b> to create an account, <b>/login</b> to log in, and <b>/tasks/:userId</b> to view tasks for a user.</p>"
  );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
