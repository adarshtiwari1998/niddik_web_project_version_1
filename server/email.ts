
import nodemailer from 'nodemailer';
import { format } from 'date-fns';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  adminEmails: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      user: process.env.EMAIL_USER || 'jobs@niddik.com',
      pass: process.env.EMAIL_PASS || 'mA3',
      adminEmails: (process.env.ADMIN_EMAILS || 'info@niddik.com,aanchal@niddik.com').split(',')
    };

    // Determine base URL based on environment
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://niddik.com' 
      : `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}`;

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  private getBaseUrl(requestOrigin?: string): string {
    if (requestOrigin) {
      return requestOrigin;
    }
    return this.baseUrl;
  }

  private getEmailTemplate(content: string, title: string = 'Niddik Notification'): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #ffffff;
                color: #333333;
                padding: 30px 20px;
                text-align: center;
                border-bottom: 2px solid #f0f0f0;
            }
            .logo {
                max-width: 200px;
                height: auto;
                margin-bottom: 15px;
            }
            .tagline {
                font-size: 14px;
                color: #16a34a;
                font-weight: 500;
            }
            .content {
                padding: 40px 30px;
                color: #333333;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #16a34a, #22c55e);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
                text-align: center;
            }
            .button:hover {
                background: linear-gradient(135deg, #15803d, #16a34a);
            }
            .footer {
                background-color: #ffffff;
                padding: 25px 30px;
                text-align: center;
                border-top: 2px solid #f0f0f0;
                color: #6c757d;
                font-size: 14px;
            }
            .footer-logo {
                max-width: 120px;
                height: auto;
                margin-bottom: 15px;
            }
            .footer-links {
                margin: 15px 0;
            }
            .footer-links a {
                color: #16a34a;
                text-decoration: none;
                margin: 0 10px;
            }
            .social-links {
                margin-top: 20px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #6c757d;
                text-decoration: none;
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e9ecef, transparent);
                margin: 30px 0;
            }
            .highlight-box {
                background-color: #f8fffe;
                border-left: 4px solid #16a34a;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748531500/Niddik-Assets/seo-meta/seo-meta_1748531498908_niddik_logo.png" alt="NiDDiK Logo" class="logo" />
                <div class="tagline">Connecting People, Changing Lives</div>
            </div>
            
            <div class="content">
                ${content}
            </div>
            
            <div class="footer">
                <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748531500/Niddik-Assets/seo-meta/seo-meta_1748531498908_niddik_logo.png" alt="NiDDiK Logo" class="footer-logo" />
                <p><strong>NiDDiK</strong> - Premier IT Recruitment & Staffing Solutions</p>
                <div class="footer-links">
                    <a href="https://niddik.com">Website</a> |
                    <a href="https://niddik.com/careers">Browse Jobs</a> |
                    <a href="https://niddik.com/contact">Contact Us</a> |
                    <a href="https://niddik.com/about-us">About Us</a>
                </div>
                <div class="divider"></div>
                <p>
                    This email was sent to you as part of your Niddik account activities.<br>
                    If you have any questions, please contact us at 
                    <a href="mailto:info@niddik.com">info@niddik.com</a>
                </p>
                <div class="social-links">
                    <a href="https://www.linkedin.com/company/niddik/">LinkedIn</a> |
                    <a href="https://www.youtube.com/@NiddikkareLLP">YouTube</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                    © ${new Date().getFullYear()} NiDDiK. All rights reserved.<br>
                    Premier IT Recruitment & Staffing Solutions
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendWelcomeEmail(userEmail: string, userName: string, requestOrigin?: string): Promise<boolean> {
    try {
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Welcome to NiDDiK! 🎉</h2>
        
        <p>Dear <strong>${userName}</strong>,</p>
        
        <p>Congratulations! Your account has been successfully created on NiDDiK, the premier platform for IT recruitment and staffing solutions.</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">What's Next?</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Complete your profile for better job matching</li>
                <li>Browse thousands of exciting job opportunities</li>
                <li>Apply to positions that match your skills</li>
                <li>Track your application status in real-time</li>
            </ul>
        </div>
        
        <p>Ready to discover your next career opportunity?</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/candidate/dashboard" class="button">
                Access Your Dashboard
            </a>
        </div>
        
        <p>Our platform connects talented professionals like you with leading companies across various industries. Whether you're looking for your next big career move or exploring new opportunities, we're here to help you succeed.</p>
        
        <p>If you have any questions or need assistance, our support team is always ready to help you at <a href="mailto:info@niddik.com" style="color: #16a34a;">info@niddik.com</a>.</p>
        
        <p>Best regards,<br>
        <strong>The NiDDiK Team</strong><br>
        <em>Connecting People, Changing Lives</em></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Team" <${this.config.user}>`,
        to: userEmail,
        subject: '🎉 Welcome to NiDDiK - Your Journey Starts Now!',
        html: this.getEmailTemplate(content, 'Welcome to NiDDiK')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent successfully to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendLoginNotification(userEmail: string, userName: string, loginTime: Date, ipAddress?: string, requestOrigin?: string): Promise<boolean> {
    try {
      const formattedTime = format(loginTime, 'MMMM dd, yyyy \'at\' hh:mm a');
      
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Security Alert: Account Login 🔐</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        
        <p>We wanted to let you know that your NiDDiK account was accessed recently.</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Login Details:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>📅 Date & Time:</strong> ${formattedTime}</li>
                <li><strong>📧 Email:</strong> ${userEmail}</li>
                ${ipAddress ? `<li><strong>🌐 IP Address:</strong> ${ipAddress}</li>` : ''}
                <li><strong>🖥️ Platform:</strong> NiDDiK Web Application</li>
            </ul>
        </div>
        
        <p>If this was you, no further action is needed. You can safely ignore this email.</p>
        
        <p><strong>⚠️ If you did not sign in to your account:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Please change your password immediately</li>
            <li>Contact our support team at <a href="mailto:info@niddik.com" style="color: #16a34a;">info@niddik.com</a></li>
            <li>Review your account activity for any unauthorized changes</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/candidate/profile" class="button">
                Secure My Account
            </a>
        </div>
        
        <p>Your account security is our top priority. We send these notifications to help keep your account safe.</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Security Team</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Security" <${this.config.user}>`,
        to: userEmail,
        subject: '🔐 NiDDiK Account Login Notification',
        html: this.getEmailTemplate(content, 'Account Login Notification')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Login notification sent successfully to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending login notification:', error);
      return false;
    }
  }

  async sendJobApplicationConfirmation(
    userEmail: string, 
    userName: string, 
    jobTitle: string, 
    company: string, 
    applicationDate: Date,
    requestOrigin?: string
  ): Promise<boolean> {
    try {
      const formattedDate = format(applicationDate, 'MMMM dd, yyyy \'at\' hh:mm a');
      
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Application Submitted Successfully! ✅</h2>
        
        <p>Dear <strong>${userName}</strong>,</p>
        
        <p>Great news! Your job application has been successfully submitted and is now under review.</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Application Details:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>💼 Position:</strong> ${jobTitle}</li>
                <li><strong>🏢 Company:</strong> ${company}</li>
                <li><strong>📅 Applied On:</strong> ${formattedDate}</li>
                <li><strong>📧 Contact Email:</strong> ${userEmail}</li>
                <li><strong>⚡ Status:</strong> <span style="color: #16a34a; font-weight: bold;">Under Review</span></li>
            </ul>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol style="margin: 15px 0; padding-left: 20px;">
            <li><strong>Application Review:</strong> The hiring team will review your application and resume</li>
            <li><strong>Initial Screening:</strong> If selected, you may receive a call or email for initial screening</li>
            <li><strong>Interview Process:</strong> Qualified candidates will be invited for interviews</li>
            <li><strong>Final Decision:</strong> You'll be notified of the final decision via email</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/my-applications" class="button">
                Track Application Status
            </a>
        </div>
        
        <p><strong>💡 Pro Tips while you wait:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Keep your profile updated with latest skills and experience</li>
            <li>Explore other relevant opportunities on our platform</li>
            <li>Prepare for potential interviews by researching the company</li>
            <li>Check your application status regularly in your dashboard</li>
        </ul>
        
        <p>We'll keep you updated throughout the process. If you have any questions about your application, feel free to reach out to us.</p>
        
        <p>Best of luck with your application!</p>
        
        <p>Best regards,<br>
        <strong>The NiDDiK Team</strong><br>
        <em>Connecting People, Changing Lives</em></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Applications" <${this.config.user}>`,
        to: userEmail,
        subject: `✅ Application Confirmed: ${jobTitle} at ${company}`,
        html: this.getEmailTemplate(content, 'Job Application Confirmation')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Application confirmation sent successfully to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending application confirmation:', error);
      return false;
    }
  }

  async sendAdminJobApplicationNotification(
    userName: string,
    userEmail: string,
    jobTitle: string,
    company: string,
    applicationDate: Date,
    userPhone?: string,
    userExperience?: string,
    userSkills?: string,
    requestOrigin?: string
  ): Promise<boolean> {
    try {
      const formattedDate = format(applicationDate, 'MMMM dd, yyyy \'at\' hh:mm a');
      
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">New Job Application Received! 📋</h2>
        
        <p>Hello Admin Team,</p>
        
        <p>A new job application has been submitted through the NiDDiK platform. Here are the details:</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Job Details:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>💼 Position:</strong> ${jobTitle}</li>
                <li><strong>🏢 Company:</strong> ${company}</li>
                <li><strong>📅 Applied On:</strong> ${formattedDate}</li>
            </ul>
        </div>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Candidate Information:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>👤 Name:</strong> ${userName}</li>
                <li><strong>📧 Email:</strong> ${userEmail}</li>
                ${userPhone ? `<li><strong>📱 Phone:</strong> ${userPhone}</li>` : ''}
                ${userExperience ? `<li><strong>💼 Experience:</strong> ${userExperience} years</li>` : ''}
                ${userSkills ? `<li><strong>🛠️ Skills:</strong> ${userSkills}</li>` : ''}
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/admin/candidates" class="button">
                Review Application
            </a>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ol style="margin: 15px 0; padding-left: 20px;">
            <li>Review the candidate's complete application in the admin dashboard</li>
            <li>Download and assess their resume</li>
            <li>Update application status as needed</li>
            <li>Contact the candidate if they meet the requirements</li>
        </ol>
        
        <p>Please log in to the admin dashboard to review the complete application details and take appropriate action.</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Application System</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK System" <${this.config.user}>`,
        to: this.config.adminEmails,
        subject: `🔔 New Application: ${jobTitle} at ${company} - ${userName}`,
        html: this.getEmailTemplate(content, 'New Job Application')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Admin notification sent successfully for application: ${jobTitle} by ${userName}`);
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string, requestOrigin?: string): Promise<boolean> {
    try {
      const resetUrl = `${this.getBaseUrl(requestOrigin)}/reset-password?token=${resetToken}`;
      
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Password Reset Request 🔑</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        
        <p>We received a request to reset the password for your NiDDiK account. If you made this request, please click the button below to reset your password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">
                Reset My Password
            </a>
        </div>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #e11d48;">Important Security Information:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>⏰ This link expires in 1 hour</strong> for your security</li>
                <li>🔒 This link can only be used once</li>
                <li>🛡️ If you didn't request this reset, please ignore this email</li>
                <li>🔐 Your current password remains unchanged until you create a new one</li>
            </ul>
        </div>
        
        <p><strong>Alternative option:</strong> If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 14px;">
            ${resetUrl}
        </p>
        
        <p><strong>⚠️ Didn't request this reset?</strong></p>
        <p>If you didn't request a password reset, someone else might have entered your email address by mistake. You can safely ignore this email - your account remains secure and no changes have been made.</p>
        
        <p>For additional security, consider:</p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Using a strong, unique password</li>
            <li>Not sharing your login credentials</li>
            <li>Logging out from shared computers</li>
        </ul>
        
        <p>If you continue to receive these emails or have security concerns, please contact our support team immediately at <a href="mailto:info@niddik.com" style="color: #16a34a;">info@niddik.com</a>.</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Security Team</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Security" <${this.config.user}>`,
        to: userEmail,
        subject: '🔑 Reset Your NiDDiK Password',
        html: this.getEmailTemplate(content, 'Password Reset')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent successfully to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  async sendPasswordResetConfirmation(userEmail: string, userName: string, requestOrigin?: string): Promise<boolean> {
    try {
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Password Successfully Updated! ✅</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        
        <p>Great news! Your NiDDiK account password has been successfully updated.</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Security Confirmation:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>📅 Changed On:</strong> ${format(new Date(), 'MMMM dd, yyyy \'at\' hh:mm a')}</li>
                <li><strong>📧 Account:</strong> ${userEmail}</li>
                <li><strong>🔐 Status:</strong> <span style="color: #16a34a; font-weight: bold;">Password Updated Successfully</span></li>
            </ul>
        </div>
        
        <p>Your account is now secured with your new password. You can use it to sign in to your NiDDiK account immediately.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/auth" class="button">
                Sign In Now
            </a>
        </div>
        
        <p><strong>🛡️ Security Reminder:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Keep your password confidential and don't share it with anyone</li>
            <li>Use a unique password that you don't use for other accounts</li>
            <li>Consider updating your password periodically for better security</li>
            <li>Sign out from shared or public computers after use</li>
        </ul>
        
        <p><strong>⚠️ Didn't make this change?</strong></p>
        <p>If you didn't reset your password, please contact our support team immediately at <a href="mailto:info@niddik.com" style="color: #16a34a;">info@niddik.com</a>. This could indicate unauthorized access to your account.</p>
        
        <p>Thank you for keeping your account secure!</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Security Team</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Security" <${this.config.user}>`,
        to: userEmail,
        subject: '✅ NiDDiK Password Updated Successfully',
        html: this.getEmailTemplate(content, 'Password Updated')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset confirmation sent successfully to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset confirmation:', error);
      return false;
    }
  }

  async sendAdminRegistrationNotification(
    userName: string,
    userEmail: string,
    userPhone?: string,
    userLocation?: string,
    userSkills?: string,
    requestOrigin?: string
  ): Promise<boolean> {
    try {
      const registrationDate = new Date();
      const formattedDate = format(registrationDate, 'MMMM dd, yyyy \'at\' hh:mm a');
      
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">New User Registration! 🎉</h2>
        
        <p>Hello Admin Team,</p>
        
        <p>A new user has successfully registered on the NiDDiK platform. Here are the details:</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">User Information:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>👤 Name:</strong> ${userName}</li>
                <li><strong>📧 Email:</strong> ${userEmail}</li>
                ${userPhone ? `<li><strong>📱 Phone:</strong> ${userPhone}</li>` : ''}
                ${userLocation ? `<li><strong>📍 Location:</strong> ${userLocation}</li>` : ''}
                ${userSkills ? `<li><strong>🛠️ Skills:</strong> ${userSkills}</li>` : ''}
                <li><strong>📅 Registered On:</strong> ${formattedDate}</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/admin/users" class="button">
                View User Profile
            </a>
        </div>
        
        <p><strong>Quick Stats:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>User can now browse and apply for job listings</li>
            <li>Profile information can be updated by the user</li>
            <li>Admin can view full profile in the admin dashboard</li>
            <li>User will receive welcome email with platform guidance</li>
        </ul>
        
        <p>Please log in to the admin dashboard to review the complete user profile and monitor platform activity.</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Registration System</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK System" <${this.config.user}>`,
        to: this.config.adminEmails,
        subject: `🔔 New User Registered: ${userName} (${userEmail})`,
        html: this.getEmailTemplate(content, 'New User Registration')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Admin registration notification sent successfully for user: ${userName}`);
      return true;
    } catch (error) {
      console.error('Error sending admin registration notification:', error);
      return false;
    }
  }

  async sendApplicationStatusChangeNotification(
    userEmail: string,
    userName: string,
    jobTitle: string,
    company: string,
    oldStatus: string,
    newStatus: string,
    requestOrigin?: string
  ): Promise<boolean> {
    try {
      const statusMessages = {
        new: {
          title: 'Application Received',
          message: 'Your application has been received and is being processed.',
          color: '#3b82f6',
          icon: '📥'
        },
        reviewing: {
          title: 'Application Under Review',
          message: 'Great news! Your application is now under review by our hiring team.',
          color: '#f59e0b',
          icon: '👀'
        },
        interview: {
          title: 'Interview Scheduled',
          message: 'Excellent! You\'ve been selected for an interview. Someone from our team will contact you soon.',
          color: '#8b5cf6',
          icon: '🎯'
        },
        hired: {
          title: 'Congratulations - You\'re Hired!',
          message: 'We\'re thrilled to offer you this position! Welcome to the team!',
          color: '#10b981',
          icon: '🎉'
        },
        rejected: {
          title: 'Application Update',
          message: 'Thank you for your interest. While we won\'t be moving forward with your application at this time, we encourage you to apply for future opportunities.',
          color: '#ef4444',
          icon: '📝'
        }
      };

      const statusInfo = statusMessages[newStatus as keyof typeof statusMessages];
      
      const content = `
        <h2 style="color: ${statusInfo.color}; margin-bottom: 20px;">${statusInfo.icon} ${statusInfo.title}</h2>
        
        <p>Dear <strong>${userName}</strong>,</p>
        
        <p>We have an update regarding your application for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: ${statusInfo.color};">Status Update:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>💼 Position:</strong> ${jobTitle}</li>
                <li><strong>🏢 Company:</strong> ${company}</li>
                <li><strong>📊 Previous Status:</strong> ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</li>
                <li><strong>🔄 New Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></li>
                <li><strong>📅 Updated On:</strong> ${format(new Date(), 'MMMM dd, yyyy \'at\' hh:mm a')}</li>
            </ul>
        </div>
        
        <p>${statusInfo.message}</p>
        
        ${newStatus === 'interview' ? `
        <p><strong>Next Steps:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>A member of our team will contact you within 1-2 business days</li>
            <li>Prepare for the interview by researching the company and role</li>
            <li>Review your resume and be ready to discuss your experience</li>
            <li>Prepare thoughtful questions about the role and company</li>
        </ul>
        ` : ''}
        
        ${newStatus === 'hired' ? `
        <p><strong>What's Next:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Our HR team will contact you with next steps</li>
            <li>You'll receive information about onboarding</li>
            <li>Welcome to the ${company} family!</li>
        </ul>
        ` : ''}
        
        ${newStatus === 'rejected' ? `
        <p><strong>Keep Moving Forward:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Continue exploring opportunities on our platform</li>
            <li>Consider updating your profile with new skills</li>
            <li>Apply to other positions that match your experience</li>
            <li>We appreciate your interest in working with us</li>
        </ul>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/my-applications" class="button">
                View Application Status
            </a>
        </div>
        
        <p>If you have any questions about this update, please don't hesitate to contact us at <a href="mailto:info@niddik.com" style="color: #16a34a;">info@niddik.com</a>.</p>
        
        <p>Best regards,<br>
        <strong>The NiDDiK Team</strong><br>
        <em>Connecting People, Changing Lives</em></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Careers" <${this.config.user}>`,
        to: userEmail,
        subject: `${statusInfo.icon} Application Update: ${jobTitle} at ${company}`,
        html: this.getEmailTemplate(content, `Application Status Update - ${statusInfo.title}`)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Status change notification sent successfully to ${userEmail} for status: ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Error sending status change notification:', error);
      return false;
    }
  }

  async sendAdminStatusChangeNotification(
    adminEmail: string,
    userName: string,
    userEmail: string,
    jobTitle: string,
    company: string,
    oldStatus: string,
    newStatus: string,
    adminName: string,
    requestOrigin?: string
  ): Promise<boolean> {
    try {
      const content = `
        <h2 style="color: #16a34a; margin-bottom: 20px;">Application Status Updated 🔄</h2>
        
        <p>Hello Admin Team,</p>
        
        <p>An application status has been updated by <strong>${adminName}</strong>. Here are the details:</p>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #16a34a;">Application Details:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>💼 Position:</strong> ${jobTitle}</li>
                <li><strong>🏢 Company:</strong> ${company}</li>
                <li><strong>👤 Candidate:</strong> ${userName}</li>
                <li><strong>📧 Candidate Email:</strong> ${userEmail}</li>
                <li><strong>📅 Updated On:</strong> ${format(new Date(), 'MMMM dd, yyyy \'at\' hh:mm a')}</li>
                <li><strong>👨‍💼 Updated By:</strong> ${adminName}</li>
            </ul>
        </div>
        
        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #2563eb;">Status Change:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; list-style: none;">
                <li><strong>📊 From:</strong> ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</li>
                <li><strong>🔄 To:</strong> <span style="color: #16a34a; font-weight: bold;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></li>
            </ul>
        </div>
        
        <p><strong>Automatic Actions Taken:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px;">
            <li>✅ Candidate has been notified via email about the status change</li>
            <li>📊 Application status updated in the database</li>
            <li>📋 Activity logged for audit trail</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.getBaseUrl(requestOrigin)}/admin/candidates" class="button">
                View All Applications
            </a>
        </div>
        
        <p>This is an automated notification to keep you informed of application status changes.</p>
        
        <p>Best regards,<br>
        <strong>NiDDiK Admin System</strong></p>
      `;

      const mailOptions = {
        from: `"NiDDiK Admin System" <${this.config.user}>`,
        to: this.config.adminEmails,
        subject: `🔄 Status Updated: ${jobTitle} - ${userName} (${oldStatus} → ${newStatus})`,
        html: this.getEmailTemplate(content, 'Application Status Update')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Admin status change notification sent successfully for ${userName}'s application`);
      return true;
    } catch (error) {
      console.error('Error sending admin status change notification:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connected successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
