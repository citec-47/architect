const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
// For demo: using Ethereal (test service) - replace with real SMTP in production
let transporter;

const initEmailService = async () => {
  try {
    // For production, use environment variables:
    // const transporter = nodemailer.createTransport({
    //   service: process.env.EMAIL_SERVICE,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // For demo/testing, use Ethereal
    if (process.env.NODE_ENV === 'production') {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  } catch (error) {
    console.error('Email service initialization error:', error);
  }
};

// Send contact form email
const sendContactEmail = async (name, email, message) => {
  try {
    if (!transporter) {
      await initEmailService();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@architectsilas.com',
      to: process.env.ADMIN_EMAIL || 'admin@architectsilas.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

// Send contact confirmation email to visitor
const sendConfirmationEmail = async (email, name) => {
  try {
    if (!transporter) {
      await initEmailService();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@architectsilas.com',
      to: email,
      subject: 'We Received Your Message - Architect Silas',
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>Architect Silas</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw - don't fail the contact submission if confirmation email fails
  }
};

module.exports = {
  initEmailService,
  sendContactEmail,
  sendConfirmationEmail,
};
