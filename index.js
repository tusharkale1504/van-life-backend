import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());  // Middleware to parse JSON data from the client

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "VanLife",
  password: "ashlesha",  // Update with your actual password
  port: 5432,
});

db.connect();

// Endpoint to get all vans
app.get("/vans", (req, res) => {
  db.query("SELECT * FROM vans", (err, result) => {
    if (err) {
      console.error("Error fetching vans", err.stack);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result.rows);
    }
  });
});

// Endpoint to get van details by ID
app.get("/vans/:id", (req, res) => {
  const vanId = req.params.id;
  db.query("SELECT * FROM vans WHERE id = $1", [vanId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error retrieving van" });
    } else {
      res.json(result.rows[0]);
    }
  });
});

// Backend (Express) - POST /book-van route
app.post("/book-van", (req, res) => {
  const { vanId } = req.body;

  if (!vanId) {
    return res.status(400).json({ error: "Van ID is required" });
  }

  db.query(
    "INSERT INTO bookings (van_id) VALUES ($1) RETURNING *",
    [vanId],
    (err, result) => {
      if (err) {
        console.error("Error booking van", err.stack);
        res.status(500).json({ error: "Failed to book van" });
      } else {
        res.status(201).json({
          message: "Booking successful",
          booking: result.rows[0], // Return the new booking details
        });
      }
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
