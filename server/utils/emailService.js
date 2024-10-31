const nodemailer = require("nodemailer");

// Create a transporter object using your SMTP configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a booking confirmation email to the customer
const sendConfirmationEmail = async (bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: bookingDetails.email,
    subject: "Booking Confirmation",
    text:
      `Dear ${bookingDetails.firstName} ${bookingDetails.lastName},\n\n` +
      `Thank you for booking with us! Your appointment has been successfully scheduled.\n\n` +
      `**Appointment Details:**\n` +
      `- **Service Name:** ${bookingDetails.serviceName}\n` +
      `- **Provider Name:** ${bookingDetails.providerName}\n` +
      `- **Date:** ${bookingDetails.date}\n` +
      `- **Start Time:** ${bookingDetails.startTime}\n` +
      `- **End Time:** ${bookingDetails.endTime}\n` +
      `- **Price:** $${bookingDetails.price}\n` +
      `- **Note:** ${bookingDetails.note || "No comments"}\n\n` +
      `We look forward to seeing you soon! If you have any questions or need to reschedule, please feel free to reach out to us.\n\n` +
      `Best regards,\n` +
      `Your Booking Team`,
    html:
      `<p>Dear ${bookingDetails.firstName} ${bookingDetails.lastName},</p>` +
      `<p>Thank you for booking with us! Your appointment has been successfully scheduled.</p>` +
      `<p><strong>Appointment Details:</strong></p>` +
      `<ul>` +
      `<li><strong>Service Name:</strong> ${bookingDetails.serviceName}</li>` +
      `<li><strong>Provider Name:</strong> ${bookingDetails.providerName}</li>` +
      `<li><strong>Date:</strong> ${bookingDetails.date}</li>` +
      `<li><strong>Start Time:</strong> ${bookingDetails.startTime}</li>` +
      `<li><strong>End Time:</strong> ${bookingDetails.endTime}</li>` +
      `<li><strong>Price:</strong> $${bookingDetails.price}</li>` +
      `<li><strong>Note:</strong> ${
        bookingDetails.comments || "No comments"
      }</li>` +
      `</ul>` +
      `<p>We look forward to seeing you soon! If you have any questions or need to reschedule, please feel free to reach out to us.</p>` +
      `<p>Best regards,<br>Your Booking Team</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${bookingDetails.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

module.exports = {
  sendConfirmationEmail,
};
