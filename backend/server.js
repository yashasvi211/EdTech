const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors"); // Add CORS support
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err) => {
      if (err) {
        console.error("Database Error:", err); // Log error for debugging
        return res.status(500).send("Database Error");
      }
      res.send("User registered successfully!");
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

// Server home route to explain endpoints
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Auth Server</h1><p>Use <b>/signup</b> to create an account and <b>/login</b> to log in.</p>"
  );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
