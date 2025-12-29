import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

/**
 * 📧 Send Bulk Emails
 */
export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({ message: "Subject, body & recipients required" });
    }

    // 🔥 Gmail SMTP Working Config for Railway Deployment
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,           // TLS port (465 fails in Railway hosting)
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
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
    console.error("❌ EMAIL SEND ERROR:", error.message);

    await EmailLog.create({
      subject: req.body.subject,
      body: req.body.body,
      recipients: req.body.recipients || [],
      status: "FAILED",
    });

    return res.status(500).json({ success: false, message: "Mail Sending Failed", error: error.message });
  }
};

/**
 * 📜 Get Email History
 */
export const getHistory = async (req, res) => {
  try {
    const history = await EmailLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json(history);
  } catch (error) {
    console.error("❌ HISTORY FETCH ERROR:", error.message);
    return res.status(500).json({ message: "Failed to fetch history" });
  }
};
