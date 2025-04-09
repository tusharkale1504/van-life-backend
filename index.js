
import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const PORT = 3000; 

app.use(cors()); 

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "VanLife",
  password: "tushar@2003",
  port: 5432,
});

db.connect();


app.get("/vans", (req, res) => {
  db.query("SELECT * FROM vans", (err, result) => {
    if (err) {
      console.error("Error fetching data", err.stack);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result.rows);
    }
  });
});

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
  


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
