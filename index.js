import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ============================
// 🔥 CORS FIX — working version
// ============================
const allowedOrigins = [
  process.env.FRONTEND_URL,                   // Main production frontend
  "http://localhost:5173",                    // Local testing
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Handle preflight requests globally
app.options("*", cors());

// Parse JSON
app.use(express.json());

// ============================
// 📌 Test Route
// ============================
app.get("/", (req, res) => {
  res.json({
    status: "backend alive",
    frontend: process.env.FRONTEND_URL,
  });
});

// ============================
// 📌 API Routes
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ============================
// 🚀 Start Server
// ============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
