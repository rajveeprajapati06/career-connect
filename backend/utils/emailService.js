const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      'WARNING: Email service not configured. Set EMAIL_USER and EMAIL_PASS in your .env file to enable email notifications.'
    );
    console.log(`[SIMULATED EMAIL SENT] To: ${to} | Subject: ${subject}`);
    return { success: true, message: 'Email simulated successfully' };
  }

  try {
    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"CareerConnect" <noreply@careerconnect.com>',
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email delivery failed: ${error.message}`);
    // Return success: false, but don't throw an unhandled exception so the main request still completes
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
