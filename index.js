import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---------------- CORS FIX ----------------
app.use(cors({
  origin: "https://wrongturn-bulkemailapp-u8hm.vercel.app", // your frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// handle OPTIONS preflight requests
app.options("*", cors());

// body parser
app.use(express.json());

// ---------------- Routes ----------------
app.get("/", (req, res) => {
  res.send("🚀 Bulk Email Backend is Live!");
});

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ---------------- Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on PORT ${PORT}`));
