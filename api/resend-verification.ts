import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const emailUser = process.env.EMAIL_USER || '';
const emailPass = process.env.EMAIL_PASS || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

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
          <h1 style="color:#f5a623;margin:0;font-size:28px;font-weight:800;letter-spacing:1px;">&#x1F41D; BeeBridge</h1>
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId are required' });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('updated_at')
      .eq('user_id', userId)
      .single();

    if (!existingProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Rate limiting: check last update (60 second cooldown)
    if (existingProfile.updated_at) {
      const lastUpdate = new Date(existingProfile.updated_at).getTime();
      const now = Date.now();
      const cooldownMs = 60 * 1000;
      if (now - lastUpdate < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - (now - lastUpdate)) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSeconds} seconds before requesting another email.`,
          retryAfter: waitSeconds,
        });
      }
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Update token in DB
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        verification_token: token,
        token_expires_at: tokenExpiry,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating verification token:', updateError);
      return res.status(500).json({ error: 'Failed to update verification token' });
    }

    // Send email
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"BeeBridge" <${emailUser}>`,
      to: email,
      subject: 'Confirm your signup - BeeBridge',
      html: generateVerificationEmail(email, verifyUrl),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Verification email resent successfully' });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
