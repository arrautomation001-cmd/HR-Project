import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import pool from "./config/db.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Overtime Automation API Running");
});




pool.query("SELECT NOW()")
  .then((result) => {
    console.log("Database Connected:", result.rows[0]);
  })
  .catch((err) => {
    console.error("Database Connection Error:");
    console.error(err);
  });


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http:localhost:${PORT}`);
});

