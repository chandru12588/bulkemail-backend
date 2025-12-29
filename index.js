import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --------------- CORS FIX ---------------
app.use(cors()); // enable for all initially

// Or restrict strictly if needed:
// app.use(cors({
//   origin: "https://wrongturn-bulkemailapp-u8hm.vercel.app",
//   methods: ["GET","POST","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"]
// }));

app.use(express.json());

// Very important – handles preflight automatically
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// --------------- Routes ---------------
app.get("/", (req, res) => {
  res.send("🚀 Bulk Email Backend Live!");
});

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

// --------------- Server ---------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on port ${PORT}`));
