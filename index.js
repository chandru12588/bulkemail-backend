import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---- CORS (must load before routes) ----
app.use(cors({
  origin: "https://wrongturn-bulkemailapp-u8hm.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ---- Preflight handler (works only with express v4) ----
app.options("/*", (req, res) => {
  res.sendStatus(200);
});

// ---- Routes ----
app.get("/", (req, res) => res.send("🚀 Bulk Email Backend Live!"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// ---- Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at ${PORT}`));
