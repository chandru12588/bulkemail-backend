import sgMail from "@sendgrid/mail";
import EmailLog from "../models/EmailLog.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({ message: "Subject, body & recipients required" });
    }

    const messages = recipients.map(email => ({
      to: email,
      from: {
        email: process.env.EMAIL_USER,       // verified sender email
        name: "WrongTurnClub Holidays"
      },
      subject,
      html: body,
    }));

    await sgMail.send(messages);

    await EmailLog.create({ subject, body, recipients, status: "SUCCESS" });

    return res.json({ success: true, message: "Emails sent successfully 🚀" });

  } catch (error) {
    console.error("❌ SENDGRID ERROR:", error.response?.body || error.message);

    await EmailLog.create({
      subject: req.body.subject,
      body: req.body.body,
      recipients: req.body.recipients || [],
      status: "FAILED",
    });

    return res.status(500).json({
      success: false,
      message: "Mail Sending Failed ❌",
      error: error.message,
    });
  }
};
