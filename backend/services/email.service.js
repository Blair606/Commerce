import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendNewUserNotification = async (adminEmail, newUser) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: 'New User Registration',
    html: `
      <h2>New User Registration</h2>
      <p>A new user has registered and requires approval:</p>
      <ul>
        <li><strong>Username:</strong> ${newUser.username}</li>
        <li><strong>Email:</strong> ${newUser.email}</li>
        <li><strong>Registration Date:</strong> ${new Date(newUser.created_at).toLocaleString()}</li>
      </ul>
      <p>Please log in to the admin panel to approve or reject this user.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New user notification sent to admin');
  } catch (error) {
    console.error('Error sending new user notification:', error);
  }
};

export const sendApprovalNotification = async (userEmail, username) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Account Approved',
    html: `
      <h2>Account Approved</h2>
      <p>Dear ${username},</p>
      <p>Your account has been approved by the administrator. You can now log in to the platform.</p>
      <p>Thank you for your patience.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval notification sent to user');
  } catch (error) {
    console.error('Error sending approval notification:', error);
  }
};

export const sendRejectionNotification = async (userEmail, username) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Account Rejected',
    html: `
      <h2>Account Rejected</h2>
      <p>Dear ${username},</p>
      <p>We regret to inform you that your account registration has been rejected by the administrator.</p>
      <p>If you believe this is an error, please contact our support team.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejection notification sent to user');
  } catch (error) {
    console.error('Error sending rejection notification:', error);
  }
}; 