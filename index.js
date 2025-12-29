import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// --------------- CORS FINAL FIX ---------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://wrongturn-bulkemailapp-u8hm.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// --------------- Routes ---------------
app.get("/", (req, res) => res.send("🚀 Bulk Email Backend is Live and Running!"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// --------------- Server ---------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
