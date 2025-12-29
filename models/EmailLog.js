import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    subject: String,
    body: String,
    recipients: [String],
    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("EmailLog", emailLogSchema);
