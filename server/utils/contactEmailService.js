const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactConfirmationEmail = async (contactDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactDetails.email,
    subject: "Thank You for Reaching Out to Us!",
    text:
      `Dear ${contactDetails.firstName} ${contactDetails.lastName},\n\n` +
      `Thank you for reaching out to us! We have successfully received your message and will review it shortly.\n\n` +
      `Here is a summary of your message:\n\n` +
      `Message: "${contactDetails.message}"\n\n` +
      `We appreciate the time you've taken to get in touch with us. Our team will respond as soon as possible to assist you with your request. In the meantime, feel free to browse our website or check out our FAQs for more information.\n\n` +
      `If you have any immediate concerns, please don’t hesitate to reach out to us directly.\n\n` +
      `Best regards,\n` +
      `The Support Team at Your Company Name`,
    html:
      `<html>` +
      `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">` +
      `<div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">` +
      `<h2 style="color: #333; text-align: center;">Thank You for Reaching Out to Us!</h2>` +
      `<p style="color: #555;">Dear <strong>${contactDetails.firstName} ${contactDetails.lastName}</strong>,</p>` +
      `<p style="color: #555;">Thank you for reaching out to us! We have successfully received your message and our team will review it shortly. We’re dedicated to assisting you in the best way possible and will get back to you as soon as we can.</p>` +
      `<p style="color: #555; font-style: italic;"><strong>Your Message:</strong></p>` +
      `<blockquote style="background-color: #f4f4f4; border-left: 4px solid #009688; padding: 10px; font-size: 1.1em; color: #333;">` +
      `${contactDetails.message}` +
      `</blockquote>` +
      `<p style="color: #555;">We appreciate the time you’ve taken to get in touch. Our team will respond as quickly as possible to assist you with your request. In the meantime, feel free to explore our website or check out our FAQ section for more information.</p>` +
      `<p style="color: #555;">If you have any immediate questions or concerns, please don’t hesitate to reach out to us directly by replying to this email.</p>` +
      `<br>` +
      `<p style="color: #555;">Best regards,<br><strong>The Support Team</strong><br>Appoint Me</p>` +
      `<p style="color: #777; font-size: 0.9em; text-align: center;">` +
      `<em>If you did not request this or believe this is an error, please ignore this message.</em>` +
      `</p>` +
      `</div>` +
      `</body>` +
      `</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Contact form confirmation email sent to ${contactDetails.email}`
    );
  } catch (error) {
    console.error("Error sending contact form confirmation email:", error);
  }
};

module.exports = { sendContactConfirmationEmail };
