/**
 * Local development API server
 * Emulates Vercel serverless functions for local testing.
 * Run with: npx tsx api/dev-server.ts
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const jwtSecret = process.env.JWT_SECRET || '';
const emailUser = process.env.EMAIL_USER || '';
const emailPass = process.env.EMAIL_PASS || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:5174`;

console.log('🔧 Environment check:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅' : '❌ MISSING'}`);
console.log(`   SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅' : '❌ MISSING'}`);
console.log(`   JWT_SECRET: ${jwtSecret ? '✅' : '❌ MISSING'}`);
console.log(`   EMAIL_USER: ${emailUser ? '✅ ' + emailUser : '❌ MISSING'}`);
console.log(`   EMAIL_PASS: ${emailPass ? '✅' : '❌ MISSING'}`);
console.log(`   APP_URL: ${appUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateVerificationEmail(email: string, verifyUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm your email</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <div style="background:#1a1a2e;padding:32px 24px;text-align:center;">
          <h1 style="color:#f5a623;margin:0;font-size:28px;font-weight:800;letter-spacing:1px;">🐝 BeeBridge</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1a1a2e;margin:0 0 16px;font-size:22px;font-weight:700;">Confirm your email</h2>
          <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 8px;">
            Thanks for signing up for <strong>BeeBridge</strong> app!
          </p>
          <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Please confirm your email address (<a href="mailto:${email}" style="color:#f5a623;text-decoration:none;font-weight:600;">${email}</a>) by clicking the button below:
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(26,26,46,0.3);">
              Verify Email
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.5;margin:24px 0 0;border-top:1px solid #eee;padding-top:16px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <p style="color:#aaa;font-size:12px;margin:8px 0 0;">
            This link expires in 15 minutes.
          </p>
        </div>
        <div style="background:#f9f9f9;padding:16px 24px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} BeeBridge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
}

const resendTimestamps: Record<string, number> = {};
const RESEND_COOLDOWN_MS = 60 * 1000;

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/send-verification
app.post('/api/send-verification', async (req, res) => {
    try {
        const { email, userId, name } = req.body;
        console.log(`📧 send-verification called for ${email} (userId: ${userId})`);

        if (!email || !userId) {
            return res.status(400).json({ error: 'Email and userId are required' });
        }

        const token = jwt.sign(
            { userId, email, purpose: 'email-verification' },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        const { error: upsertError } = await supabase
            .from('user_profiles')
            .upsert({
                user_id: userId,
                provider: 'local',
                is_verified: false,
                verification_token: token,
                token_expires_at: tokenExpiry,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (upsertError) {
            console.error('❌ DB upsert error:', upsertError);
            return res.status(500).json({ error: 'Failed to store verification token' });
        }

        const verifyUrl = `${appUrl}/verify-email?token=${token}`;

        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"BeeBridge" <${emailUser}>`,
            to: email,
            subject: 'Confirm your signup - BeeBridge',
            html: generateVerificationEmail(email, verifyUrl),
        });

        console.log(`✅ Verification email sent to ${email}`);
        return res.status(200).json({ success: true, message: 'Verification email sent' });
    } catch (error: any) {
        console.error('❌ send-verification error:', error.message);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// GET /api/verify-email
app.get('/api/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        console.log(`🔍 verify-email called`);

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Token is required', valid: false });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, jwtSecret);
        } catch (jwtError: any) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(400).json({ error: 'Verification link has expired.', valid: false, expired: true });
            }
            return res.status(400).json({ error: 'Invalid verification link.', valid: false });
        }

        if (decoded.purpose !== 'email-verification') {
            return res.status(400).json({ error: 'Invalid token purpose.', valid: false });
        }

        const { data: profile, error: fetchError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', decoded.userId)
            .eq('verification_token', token)
            .single();

        if (fetchError || !profile) {
            return res.status(400).json({ error: 'Invalid or already used link.', valid: false });
        }

        if (profile.token_expires_at && new Date(profile.token_expires_at) < new Date()) {
            return res.status(400).json({ error: 'Link has expired.', valid: false, expired: true });
        }

        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                is_verified: true,
                verification_token: null,
                token_expires_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', decoded.userId);

        if (updateError) {
            return res.status(500).json({ error: 'Failed to verify email.', valid: false });
        }

        console.log(`✅ Email verified for user ${decoded.userId}`);
        return res.status(200).json({ success: true, valid: true, message: 'Email verified!' });
    } catch (error: any) {
        console.error('❌ verify-email error:', error.message);
        return res.status(500).json({ error: error.message, valid: false });
    }
});

// POST /api/resend-verification
app.post('/api/resend-verification', async (req, res) => {
    try {
        const { email, userId, name } = req.body;
        console.log(`🔄 resend-verification called for ${email}`);

        if (!email || !userId) {
            return res.status(400).json({ error: 'Email and userId are required' });
        }

        const lastResend = resendTimestamps[userId];
        if (lastResend && Date.now() - lastResend < RESEND_COOLDOWN_MS) {
            const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - lastResend)) / 1000);
            return res.status(429).json({ error: `Wait ${waitSeconds}s`, retryAfter: waitSeconds });
        }

        const token = jwt.sign(
            { userId, email, purpose: 'email-verification' },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                verification_token: token,
                token_expires_at: tokenExpiry,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (updateError) {
            return res.status(500).json({ error: 'Failed to update token' });
        }

        const verifyUrl = `${appUrl}/verify-email?token=${token}`;
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"BeeBridge" <${emailUser}>`,
            to: email,
            subject: 'Confirm your signup - BeeBridge',
            html: generateVerificationEmail(email, verifyUrl),
        });

        resendTimestamps[userId] = Date.now();
        console.log(`✅ Verification email resent to ${email}`);
        return res.status(200).json({ success: true, message: 'Email resent' });
    } catch (error: any) {
        console.error('❌ resend-verification error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 API dev server running at http://localhost:${PORT}`);
    console.log(`   POST /api/send-verification`);
    console.log(`   GET  /api/verify-email?token=...`);
    console.log(`   POST /api/resend-verification\n`);
});
