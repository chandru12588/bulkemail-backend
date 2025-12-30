import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ------------------- FIXED CORS -------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,   // Vercel URL
  "http://localhost:5000",    // Backend local
  "http://localhost:5173"     // Vite frontend local
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// --------------------------------------------------
app.get("/", (req, res) => res.send("Backend Live 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Backend running on ${PORT}`)
);
