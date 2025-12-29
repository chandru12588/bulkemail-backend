import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --------------------- Middleware ---------------------
app.use(express.json());  // Required to read req.body from frontend

// Allow frontend access (IMPORTANT for deployment)
app.use(cors({
  origin: "*",                    // You can restrict later to Vercel domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --------------------- Routes ---------------------

// Root Test Endpoint
app.get("/", (req, res) => {
  res.send("🚀 Bulk Email Backend is Live and Running!");
});

// Auth (if used)
app.use("/api/auth", authRoutes);

// Bulk Mail Routes
app.use("/api/mail", mailRoutes);

// --------------------- Start Server ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
