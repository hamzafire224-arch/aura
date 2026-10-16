import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

if (!RESEND_API_KEY) {
    // Note: Emails in production are dispatched via Supabase Auth SMTP or backend service
    console.warn('ℹ️ VITE_RESEND_API_KEY is not defined. Client-side direct email dispatch is disabled.');
}

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Premium email template wrapper
const wrapInTemplate = (content: string, preheader = '') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #0a0a0a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(16, 185, 129, 0.2); }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo-text { font-size: 28px; font-weight: bold; background: linear-gradient(90deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; }
        h1, h2, h3 { color: #ffffff; margin: 0 0 16px 0; }
        p { color: #9ca3af; line-height: 1.6; margin: 0 0 16px 0; }
        .code-box { background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: monospace; }
        .button { display: inline-block; background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
        .footer p { font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
    <div class="container">
        <div class="card">
            <div class="logo"><span class="logo-text">AURA</span></div>
            ${content}
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} AURA Increase. All rights reserved.</p>
            <p>You're receiving this email because you signed up for AURA.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendVerificationEmail(email: string, code: string) {
    if (!resend) {
        throw new Error('Email service not configured. Please add VITE_RESEND_API_KEY to your environment.');
    }

    const content = `
        <h2 style="text-align: center;">Verify Your Account</h2>
        <p style="text-align: center;">Enter this code to complete your AURA registration:</p>
        <div class="code-box">
            <div class="code">${code}</div>
        </div>
        <p style="text-align: center; font-size: 14px;">This code expires in 15 minutes.</p>
        <p style="text-align: center; font-size: 14px; color: #6b7280;">If you didn't request this, you can safely ignore this email.</p>
    `;

    try {
        const data = await resend.emails.send({
            from: 'AURA <verify@auraincrease.com>',
            to: [email],
            subject: 'Your AURA Verification Code',
            html: wrapInTemplate(content, `Your verification code is ${code}`)
        } as any);
        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Failed to send verification email: ${(error as Error).message}`);
    }
}

export async function sendWelcomeEmail(email: string, userName: string) {
    if (!resend) {
        throw new Error('Email service not configured. Please add VITE_RESEND_API_KEY to your environment.');
    }

    const content = `
        <h2>Welcome to AURA, ${userName}! 🚀</h2>
        <p>You've just unlocked access to the most powerful AI-driven e-commerce platform on the planet.</p>
        <p>Here's what you can do next:</p>
        <ul style="color: #9ca3af; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Launch your first AI-powered store in minutes</li>
            <li style="margin-bottom: 8px;">Let our AI Boardroom strategize your niche</li>
            <li style="margin-bottom: 8px;">Earn 40% recurring commissions as an affiliate</li>
        </ul>
        <div style="text-align: center; margin-top: 32px;">
            <a href="https://auraincrease.com/dashboard" class="button">Enter Your Dashboard →</a>
        </div>
    `;

    try {
        const data = await resend.emails.send({
            from: 'AURA <welcome@auraincrease.com>',
            to: [email],
            subject: `Welcome to AURA, ${userName}! Your AI Agency Awaits`,
            html: wrapInTemplate(content, 'Your AI-powered e-commerce empire starts now.')
        } as any);
        return { success: true, data };
    } catch (error) {
        console.error('Welcome email failed:', error);
        return { success: false, error };
    }
}

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html?: string, text?: string }) {
    if (!resend) {
        throw new Error('Email service not configured. Please add VITE_RESEND_API_KEY to your environment.');
    }

    const wrappedHtml = html ? wrapInTemplate(html) : undefined;

    try {
        const data = await resend.emails.send({
            from: 'AURA <contact@auraincrease.com>',
            to: [to],
            subject: subject,
            html: wrappedHtml,
            text: text
        } as any);
        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
}
