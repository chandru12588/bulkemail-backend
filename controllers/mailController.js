import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

/**
 * 📧 Send Bulk Emails
 */
export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || !recipients.length) {
      return res.status(400).json({
        message: "Subject, body, and recipients are required",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WrongTurnClub Holidays" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject,
      html: body,
    });

    await EmailLog.create({
      subject,
      body,
      recipients,
      status: "SUCCESS",
    });

    res.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("❌ EMAIL SEND ERROR:", error.message);

    await EmailLog.create({
      subject: req.body.subject,
      body: req.body.body,
      recipients: req.body.recipients || [],
      status: "FAILED",
    });

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * 📜 Get Email History
 */
export const getHistory = async (req, res) => {
  try {
    const history = await EmailLog.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error("❌ HISTORY FETCH ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch email history" });
  }
};
