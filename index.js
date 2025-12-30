import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// === REAL FIX 🔥 (One CLEAN CORS config only) ===
app.use(cors({
  origin: process.env.FRONTEND_URL,  // https://wrongturn-bulkemailapp-u8hm.vercel.app
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// Handle preflight globally
app.options("*", cors());

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ status: "backend alive", url: process.env.FRONTEND_URL });
});

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("🚀 Backend running on port", PORT)
);
