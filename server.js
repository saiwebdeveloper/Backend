const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ MySQL connection (Railway)
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // hopper.proxy.rlwy.net
  user: process.env.DB_USER,        // root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,    // railway
  port: process.env.DB_PORT || 3306
});

// ✅ Connect to DB and log status
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Student Result API is running");
});

// ✅ API to get result by hall ticket number
app.get("/result/:hallticket", (req, res) => {
  const hallticket = req.params.hallticket;

  const query = "SELECT * FROM students WHERE hall_ticket = ?";
  db.query(query, [hallticket], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.json({ message: "No result found" });
    }

    res.json(result[0]);
  });
});

// ✅ IMPORTANT: Use Render PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


