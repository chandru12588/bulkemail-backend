import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ========== CORS FIX ==========
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

// Required to read JSON requests
app.use(express.json());

// API Health Check
app.get("/", (req, res) => res.send("🚀 Bulk Email Backend Running Successfully!"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
