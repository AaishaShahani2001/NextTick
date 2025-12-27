import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

//app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
