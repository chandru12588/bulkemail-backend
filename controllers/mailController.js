import sgMail from "@sendgrid/mail";
import EmailLog from "../models/EmailLog.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= SEND BULK MAIL =================
export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients?.length) {
      return res.status(400).json({ message: "Subject, body & recipients required" });
    }

    const messages = recipients.map(email => ({
      to: email,
      from: process.env.EMAIL_USER,           // must be verified in SendGrid
      subject,
      html: body,
    }));

    await sgMail.send(messages, { batch: true });

    await EmailLog.create({ subject, body, recipients, status:"SUCCESS" });

    return res.json({ success:true, message:"Emails sent successfully 🚀" });

  } catch (error) {
    console.error("SENDGRID ERROR:", error.response?.body?.errors || error.message);

    await EmailLog.create({
      subject:req.body.subject,
      body:req.body.body,
      recipients:req.body.recipients,
      status:"FAILED"
    });

    return res.status(500).json({
      success:false,
      message:"Mail failed",
      error:error.response?.body?.errors || error.message,
    });
  }
};


// ================= HISTORY API =================
export const getHistory = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ createdAt:-1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message:"Failed to fetch history" });
  }
};

