require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com', // Update to your region's endpoint
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_USER, // Your SMTP username
    pass: process.env.AWS_SES_PASS  // Your SMTP password
  }
});

const mailOptions = {
  from: 'your_verified_email@example.com', // Must be the verified email
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending test email:', error);
  } else {
    console.log('Test email sent:', info.response);
  }
});
