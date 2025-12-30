import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

// ================= SEND BULK MAIL ================= //
export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({ message: "Subject, body & recipients required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,      // MUST be Gmail App Password
      },
    });

    for (const email of recipients) {
      await transporter.sendMail({
        from: `"WrongTurnClub Holidays" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: body,
      });
    }

    await EmailLog.create({ subject, body, recipients, status: "SUCCESS" });

    return res.json({ success: true, message: "Emails sent successfully 🚀" });

  } catch (error) {
    console.log("❌ Mail Error:", error);
    return res.status(500).json({ success: false, message: "Mail failed", error: error.message });
  }
};


// ================= EMAIL HISTORY ================= //
export const getHistory = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load history" });
  }
};
