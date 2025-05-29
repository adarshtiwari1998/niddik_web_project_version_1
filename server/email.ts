
import nodemailer from 'nodemailer';

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.hostinger.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'jobs@niddik.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'qK#9';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'hr@niddik.com,aanchal@niddik.com').split(',');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Professional email template
const getEmailTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #16a34a;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-height: 50px;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .highlight {
            background-color: #f0f9ff;
            padding: 15px;
            border-left: 4px solid #16a34a;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NiDDiK</h1>
            <p>Connecting People, Changing Lives</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p><strong>NiDDiK - Premier IT Recruitment & Staffing Solutions</strong></p>
            <p>Platina Heights, Sector 59, Noida - 201301</p>
            <p>Phone: +91 9773120558 (INDIA) | +1 (646) 899-9537 (USA)</p>
            <p>Email: info@niddik.com | Website: https://niddik.com</p>
            <p style="margin-top: 20px; font-size: 12px; color: #ccc;">
                This email was sent from NiDDiK. If you have any questions, please contact us at jobs@niddik.com
            </p>
        </div>
    </div>
</body>
</html>
`;

// Email service functions
export const emailService = {
  // Send welcome email after registration
  async sendWelcomeEmail(userEmail: string, userName: string) {
    const content = `
      <h2>Welcome to NiDDiK, ${userName}! 🎉</h2>
      <p>Thank you for creating an account with NiDDiK. We're excited to help you find your next career opportunity!</p>
      
      <div class="highlight">
        <h3>What's Next?</h3>
        <ul>
          <li>Complete your profile with skills and experience</li>
          <li>Browse our latest job opportunities</li>
          <li>Apply to positions that match your expertise</li>
          <li>Track your application status in real-time</li>
        </ul>
      </div>
      
      <p><a href="https://niddik.com/candidate/dashboard" class="button">Access Your Dashboard</a></p>
      
      <p>If you have any questions or need assistance, our team is here to help. Simply reply to this email or contact us at jobs@niddik.com</p>
      
      <p>Best regards,<br>The NiDDiK Team</p>
    `;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to NiDDiK - Your Account is Ready!',
      html: getEmailTemplate('Welcome to NiDDiK', content),
    });
  },

  // Send login notification
  async sendLoginNotification(userEmail: string, userName: string, loginTime: string, location: string = 'Unknown') {
    const content = `
      <h2>Hello ${userName},</h2>
      <p>We're writing to let you know that you've successfully logged into your NiDDiK account.</p>
      
      <div class="highlight">
        <h3>Login Details:</h3>
        <p><strong>Time:</strong> ${loginTime}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Account:</strong> ${userEmail}</p>
      </div>
      
      <p>If this wasn't you, please secure your account immediately by changing your password or contact our support team.</p>
      
      <p><a href="https://niddik.com/candidate/profile" class="button">Manage Your Account</a></p>
      
      <p>Thank you for choosing NiDDiK!</p>
      
      <p>Best regards,<br>The NiDDiK Security Team</p>
    `;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: userEmail,
      subject: 'NiDDiK Account Login Notification',
      html: getEmailTemplate('Login Notification', content),
    });
  },

  // Send job application confirmation to user
  async sendJobApplicationConfirmation(userEmail: string, userName: string, jobTitle: string, companyName: string) {
    const content = `
      <h2>Application Submitted Successfully! ✅</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for applying through NiDDiK. Your application has been successfully submitted.</p>
      
      <div class="highlight">
        <h3>Application Details:</h3>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> Under Review</p>
      </div>
      
      <p>What happens next?</p>
      <ul>
        <li>Our team will review your application</li>
        <li>You'll receive updates on your application status</li>
        <li>If shortlisted, the hiring team will contact you directly</li>
      </ul>
      
      <p><a href="https://niddik.com/candidate/applications" class="button">Track Your Applications</a></p>
      
      <p>We appreciate your interest and wish you the best of luck!</p>
      
      <p>Best regards,<br>The NiDDiK Team</p>
    `;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: userEmail,
      subject: `Application Confirmed: ${jobTitle} at ${companyName}`,
      html: getEmailTemplate('Application Confirmation', content),
    });
  },

  // Send job application notification to admin
  async sendJobApplicationNotificationToAdmin(userName: string, userEmail: string, jobTitle: string, companyName: string) {
    const content = `
      <h2>New Job Application Received 📝</h2>
      <p>A new application has been submitted through the NiDDiK platform.</p>
      
      <div class="highlight">
        <h3>Application Details:</h3>
        <p><strong>Candidate:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p><a href="https://niddik.com/admin/candidates" class="button">Review Application</a></p>
      
      <p>Please review the application in your admin dashboard.</p>
      
      <p>Best regards,<br>NiDDiK System</p>
    `;

    // Send to all admin emails
    for (const adminEmail of ADMIN_EMAILS) {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: adminEmail.trim(),
        subject: `New Application: ${jobTitle} - ${userName}`,
        html: getEmailTemplate('New Job Application', content),
      });
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string) {
    const resetUrl = `https://niddik.com/reset-password?token=${resetToken}`;
    
    const content = `
      <h2>Password Reset Request</h2>
      <p>Hello ${userName},</p>
      <p>We received a request to reset your password for your NiDDiK account.</p>
      
      <div class="highlight">
        <p><strong>If you made this request:</strong> Click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>
      </div>
      
      <p><a href="${resetUrl}" class="button">Reset Your Password</a></p>
      
      <p>Or copy and paste this link in your browser:<br>
      <span style="color: #666; font-size: 14px;">${resetUrl}</span></p>
      
      <div class="highlight">
        <p><strong>If you didn't make this request:</strong> Your password is still secure. You can safely ignore this email.</p>
      </div>
      
      <p>For security reasons, this link will expire in 1 hour.</p>
      
      <p>If you're having trouble, contact our support team at jobs@niddik.com</p>
      
      <p>Best regards,<br>The NiDDiK Security Team</p>
    `;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: userEmail,
      subject: 'Reset Your NiDDiK Password',
      html: getEmailTemplate('Password Reset', content),
    });
  },

  // Test email connection
  async testConnection() {
    try {
      await transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, message: 'Email service configuration error' };
    }
  }
};
