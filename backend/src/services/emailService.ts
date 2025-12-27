import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send Generic Email
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"${config.email.from}" <${config.email.user}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
        // Log content for dev verification
        console.log('--- EMAIL CONTENT PREVIEW ---');
        console.log(`Subject: ${subject}`);
        console.log(`HTML: ${html}`);
        console.log('-----------------------------');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"${config.email.from}" <${config.email.user}>`,
            to,
            subject: 'Welcome to GearGuard Maintenance Tracker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to GearGuard, ${name}!</h2>
                    <p>We're excited to have you on board. Your account has been successfully created.</p>
                    <p>You can now access your dashboard to manage equipment, teams, and maintenance requests.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The GearGuard Team</p>
                </div>
            `,
        });
        console.log(`Welcome email sent to ${to}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"${config.email.from}" <${config.email.user}>`,
            to,
            subject: 'Reset Your Password - GearGuard',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Click the link below to set a new password:</p>
                    <p>
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    </p>
                    <p>This link is valid for ${config.email.otpExpiresIn} minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        console.log(`Password reset email sent to ${to}`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}
