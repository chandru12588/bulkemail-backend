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
        name: "WrongTurnClub Holidays",
        email: process.env.EMAIL_USER   // must be verified sender email in SendGrid
      },
      subject,
      html: body,
    }));

    await sgMail.send(messages, { batch: true });

    await EmailLog.create({ subject, body, recipients, status: "SUCCESS" });
    return res.json({ success:true, message:"Emails sent successfully 🚀" });

  } catch (error) {
    console.error("SENDGRID ERROR:", error.response?.body?.errors || error.message);

    await EmailLog.create({
      subject: req.body.subject,
      body: req.body.body,
      recipients: req.body.recipients || [],
      status: "FAILED",
      error: JSON.stringify(error.response?.body?.errors || error.message)
    });

    return res.status(500).json({
      success:false,
      message:"Mail failed",
      error:error.response?.body?.errors || error.message
    });
  }
};
