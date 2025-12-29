import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 1. CORS (MUST be before routes)
app.use(cors({
  origin: "https://wrongturn-bulkemailapp-u8hm.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
}));

// 2. Handle preflight OPTIONS requests globally
app.options("*", cors());

// 3. JSON parser
app.use(express.json());

// 4. Routes
app.get("/", (req, res) => res.send("🚀 Bulk Email Backend is Live!"));
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// 5. Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
