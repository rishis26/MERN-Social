import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working ");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
  connectDB();
});
