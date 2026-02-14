import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Token is required', valid: false });
        }

        // Find user profile by token
        const { data: profile, error: fetchError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('verification_token', token)
            .single();

        if (fetchError || !profile) {
            return res.status(400).json({
                error: 'Verification link is invalid or has already been used.',
                valid: false,
            });
        }

        // Check if token has expired
        if (profile.token_expires_at && new Date(profile.token_expires_at) < new Date()) {
            return res.status(400).json({
                error: 'Verification link has expired. Please request a new one.',
                valid: false,
                expired: true,
            });
        }

        // Mark user as verified and clear token
        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                is_verified: true,
                verification_token: null,
                token_expires_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', profile.user_id);

        if (updateError) {
            console.error('Error updating verification status:', updateError);
            return res.status(500).json({ error: 'Failed to verify email.', valid: false });
        }

        return res.status(200).json({ success: true, valid: true, message: 'Email verified successfully!' });
    } catch (error: any) {
        console.error('Verify email error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error', valid: false });
    }
}
