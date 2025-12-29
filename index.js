import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ------------ CORS FIX (No *) ----------
app.use(cors({
  origin: ["https://wrongturn-bulkemailapp-u8hm.vercel.app", "http://localhost:5173"],
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// ------------ Preflight Handler --------
app.options("/api/mail/send", cors());

// ------------ Routes -------------------
app.get("/", (req,res) => res.send("🚀 Bulk Email Backend is Live!"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ------------ Start Server -------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
