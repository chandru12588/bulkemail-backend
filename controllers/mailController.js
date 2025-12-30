// controllers/mailController.js
import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

export const sendBulkMail = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients?.length) {
      return res.status(400).json({ message: "Subject, body & recipients required" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",                      // important: always literal
        pass: process.env.SENDGRID_API_KEY,  // your new secret key
      },
    });

    for (const email of recipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: body,
      });
    }

    await EmailLog.create({ subject, body, recipients, status: "SUCCESS" });
    return res.json({ success: true, message: "Bulk mail sent successfully 🚀" });

  } catch (err) {
    console.log("MAIL ERROR:", err.message);
    await EmailLog.create({ subject: req.body.subject, recipients: req.body.recipients, status:"FAILED" });
    return res.status(500).json({ success:false, message:"Mail failed", error: err.message });
  }
};


// HISTORY EXPORT  <-- you missed this part earlier
export const getHistory = async (req, res) => {
  try {
    const data = await EmailLog.find().sort({ createdAt:-1 });
    res.json(data);
  } catch(e){
    res.status(500).json({message:"History fetch failed"});
  }
};
