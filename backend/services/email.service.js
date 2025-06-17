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
  }),

  newOrderNotification: (order, adminEmail) => ({
    subject: 'New Order Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Order Received</h2>
        <p>A new order has been placed and requires your attention:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.user.username}</p>
          <p><strong>Total Amount:</strong> KES ${order.total_amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        </div>
        <p>Please log in to the admin panel to process this order.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),

  orderConfirmation: (order) => ({
    subject: 'Order Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
        <p>Dear ${order.user.username},</p>
        <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> KES ${order.total_amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <h3 style="margin-top: 15px;">Order Items:</h3>
          <ul style="list-style: none; padding: 0;">
            ${order.items.map(item => `
              <li style="margin-bottom: 10px;">
                ${item.name} - Quantity: ${item.quantity} - KES ${(item.price * item.quantity).toFixed(2)}
              </li>
            `).join('')}
          </ul>
        </div>
        <p>We'll notify you when your order ships.</p>
        <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),

  orderPaidNotification: (order, adminEmail) => ({
    subject: 'Order Payment Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Payment Received</h2>
        <p>Payment has been received for the following order:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.user.username}</p>
          <p><strong>Amount Paid:</strong> KES ${order.total_amount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Payment Reference:</strong> ${order.payment_reference}</p>
          <p><strong>Date:</strong> ${new Date(order.updated_at).toLocaleString()}</p>
        </div>
        <p>Please process this order for shipping.</p>
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

export const sendNewOrderNotification = async (adminEmail, order) => {
  try {
    console.log('Sending new order notification to admin:', adminEmail);
    const { subject, html } = emailTemplates.newOrderNotification(order, adminEmail);
    return await sendEmail(adminEmail, subject, html);
  } catch (error) {
    console.error('Error sending new order notification:', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (userEmail, order) => {
  try {
    console.log('Sending order confirmation to user:', userEmail);
    const { subject, html } = emailTemplates.orderConfirmation(order);
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
};

export const sendOrderPaidNotification = async (adminEmail, order) => {
  try {
    console.log('Sending order paid notification to admin:', adminEmail);
    const { subject, html } = emailTemplates.orderPaidNotification(order, adminEmail);
    return await sendEmail(adminEmail, subject, html);
  } catch (error) {
    console.error('Error sending order paid notification:', error);
    throw error;
  }
}; 