const express = require("express");
const mysql = require("mysql2/promise"); // Import the promise version
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  //your mysql cred
});

// Keep your existing db connection for non-promise queries if needed
const db = require("mysql2").createConnection({});

// Existing connection logic
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

db.promise()
  .query("SELECT * FROM Users WHERE role = 'student'")
  .then(([rows, fields]) => {
    console.log("Students:", rows);
  })
  .catch((err) => {
    console.error("Error fetching students:", err);
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

// Courses Routes
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ message: "Error fetching courses" });
    }
    res.json(results);
  });
});

// Update Course Route
app.put("/courses/:courseId", (req, res) => {
  const { courseId } = req.params;
  const { name, description, syllabus } = req.body;

  // Check if all required fields are present
  if (!name || !description || !syllabus) {
    return res.status(400).send("All fields are required");
  }

  const updateQuery = `
    UPDATE courses
    SET name = ?, description = ?, syllabus = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [name, description, syllabus, courseId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error updating course" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Course not found");
      }

      res.json({ message: "Course updated successfully" });
    }
  );
});

app.post("/submit-assignment", (req, res) => {
  const { assignment_id, student_id, file_link } = req.body;

  const sql =
    "INSERT INTO assignment_submissions (assignment_id, student_id, file_link) VALUES (?, ?, ?)";

  db.query(sql, [assignment_id, student_id, file_link], (err, results) => {
    if (err) {
      console.error("Error submitting assignment:", err); // Log the error
      return res.status(500).send("Failed to submit assignment");
    }
    res.send({ message: "Assignment submitted successfully!" });
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
// Add Course Route
app.post("/courses", (req, res) => {
  const { name, description, syllabus } = req.body;

  // Check if all required fields are present
  if (!name || !description || !syllabus) {
    return res.status(400).send("All fields are required");
  }

  const insertQuery = `
    INSERT INTO courses (name, description, syllabus)
    VALUES (?, ?, ?)
  `;

  db.query(insertQuery, [name, description, syllabus], (err, results) => {
    if (err) {
      console.error("Error adding course:", err);
      return res.status(500).json({ error: "Error adding course" });
    }

    res
      .status(201)
      .json({ message: "Course added successfully", id: results.insertId });
  });
});
// Fetch Students Route
app.get("/students", (req, res) => {
  db.query("SELECT * FROM Users WHERE role = 'student'", (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).send("Error fetching students");
    }
    res.json(results);
  });
});
app.get("/assignmentsMain/:courseId", (req, res) => {
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
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////*****Assignment Addition */
// Fetch Assignments Route
app.get("/assignments", (req, res) => {
  const query = `
    SELECT 
      a.id AS assignment_id,
      a.title,
      a.description,
      a.pdf_link,
      a.created_at,
      c.name AS course_name
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching assignments:", err);
      return res.status(500).json({ message: "Error fetching assignments" });
    }
    res.json(results);
  });
});

// Add Assignment Route
app.post("/assignments", (req, res) => {
  const { title, description, pdf_link, course_id } = req.body;

  if (!title || !description || !pdf_link || !course_id) {
    return res.status(400).send("All fields are required");
  }

  const sql =
    "INSERT INTO assignments (course_id, title, description, pdf_link, created_at) VALUES (?, ?, ?, ?, NOW())";

  db.query(sql, [course_id, title, description, pdf_link], (err, results) => {
    if (err) {
      console.error("Error adding assignment:", err);
      return res.status(500).json({ message: "Error adding assignment" });
    }

    res.status(201).json({ message: "Assignment added successfully" });
  });
});
////////////////////////////////////////////////////////////////student data
// Express route handler
app.get("/student-assignments/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // More detailed query to get assignment details
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM assignments) AS totalAssignments,
        (
          SELECT COUNT(DISTINCT a.id) 
          FROM assignments a
          JOIN assignment_submissions ass ON a.id = ass.assignment_id
          WHERE ass.student_id = ?
        ) AS submittedAssignments,
        (
          SELECT COUNT(*) 
          FROM assignments a
          LEFT JOIN assignment_submissions ass ON a.id = ass.assignment_id AND ass.student_id = ?
          WHERE ass.id IS NULL
        ) AS pendingAssignments,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'assignment_id', a.id, 
              'title', a.title, 
              'course_name', c.name,
              'submitted', CASE WHEN ass.id IS NOT NULL THEN 1 ELSE 0 END
            )
          )
          FROM assignments a
          LEFT JOIN courses c ON a.course_id = c.id
          LEFT JOIN assignment_submissions ass ON a.id = ass.assignment_id AND ass.student_id = ?
        ) AS assignmentDetails
    `;

    // Execute the query using the pool
    const [results] = await pool.execute(query, [
      studentId,
      studentId,
      studentId,
    ]);

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    res.status(500).json({
      error: "Failed to fetch student assignments",
      details: error.message,
    });
  }
});
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Auth Server</h1><p>Use <b>/signup</b> to create an account, <b>/login</b> to log in, and <b>/tasks/:userId</b> to view tasks for a user.</p>"
  );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
