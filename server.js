const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


// API to get result by hall ticket number
app.get("/result/:hallticket", (req, res) => {
  const hallticket = req.params.hallticket;

  const query = "SELECT * FROM results WHERE hall_ticket = ?";
  db.query(query, [hallticket], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.length === 0) {
      return res.json({ message: "No result found" });
    }
    res.json(result[0]);
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
