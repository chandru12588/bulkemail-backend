import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---------- CORS (Safe & No Wildcards) ----------
app.use(cors({
  origin: "https://wrongturn-bulkemailapp-u8hm.vercel.app", // your frontend
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Global OPTIONS handler without wildcard
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ---------- Routes ----------
app.get("/", (req, res) => res.send("🚀 Bulk Email Backend Live!"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running at ${PORT}`));
