
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST /api/support/report -> send issue report email
router.post("/report", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const msg = {
      to: process.env.SUPPORT_EMAIL,
      from: process.env.SUPPORT_EMAIL,
      subject: `New Issue Report from ${name}`,
      text: `Email: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    };

    await sgMail.send(msg);

    res.json({ message: "Issue reported successfully. We will contact you soon." });
  } catch (err) {
    console.error("Support error:", err.message);
    res.status(500).json({ error: "Failed to send issue report" });
  }
});

module.exports = router;
