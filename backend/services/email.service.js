import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object
const createTransporter = () => {
  // Log configuration (without sensitive data)
  console.log('Email Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? 'configured' : 'not configured',
    pass: process.env.SMTP_PASS ? 'configured' : 'not configured'
  });

  return nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
};

// Email templates
const emailTemplates = {
  newUserNotification: (newUser) => ({
    subject: 'New User Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New User Registration</h2>
        <p>A new user has registered and requires your approval:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Username:</strong> ${newUser.username}</p>
          <p><strong>Email:</strong> ${newUser.email}</p>
          <p><strong>Registration Date:</strong> ${new Date(newUser.created_at).toLocaleString()}</p>
        </div>
        <p>Please log in to the admin panel to review and approve this registration.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),

  approvalNotification: (username) => ({
    subject: 'Account Approved - Welcome to Our Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745; border-bottom: 2px solid #eee; padding-bottom: 10px;">Account Approved</h2>
        <p>Dear ${username},</p>
        <p>Great news! Your account has been approved by our administrator. You can now log in to the platform and start using all our features.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Log in to your account</li>
            <li>Complete your profile</li>
            <li>Start exploring our platform</li>
          </ol>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),

  rejectionNotification: (username) => ({
    subject: 'Account Registration Status Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545; border-bottom: 2px solid #eee; padding-bottom: 10px;">Registration Status Update</h2>
        <p>Dear ${username},</p>
        <p>We regret to inform you that your account registration has been reviewed and was not approved at this time.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Your registration has been declined</li>
            <li>You may submit a new registration in the future</li>
            <li>If you believe this is an error, please contact our support team</li>
      </ul>
        </div>
        <p>If you have any questions about this decision, please contact our support team for more information.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  })
};

// Helper function to send emails
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  };

  try {
    console.log('Attempting to send email to:', to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Main email service functions
export const sendNewUserNotification = async (adminEmail, newUser) => {
  try {
    console.log('Sending new user notification to admin:', adminEmail);
    const { subject, html } = emailTemplates.newUserNotification(newUser);
    return await sendEmail(adminEmail, subject, html);
  } catch (error) {
    console.error('Error sending new user notification:', error);
    throw error;
  }
};

export const sendApprovalNotification = async (userEmail, username) => {
  try {
    console.log('Sending approval notification to user:', userEmail);
    const { subject, html } = emailTemplates.approvalNotification(username);
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error('Error sending approval notification:', error);
    throw error;
  }
};

export const sendRejectionNotification = async (userEmail, username) => {
  try {
    console.log('Sending rejection notification to user:', userEmail);
    const { subject, html } = emailTemplates.rejectionNotification(username);
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    throw error;
  }
}; 