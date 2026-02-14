import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Find user by reset token
        const { data: profile, error: fetchError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('reset_token', token)
            .single();

        if (fetchError || !profile) {
            return res.status(400).json({ error: 'Invalid or expired reset link.' });
        }

        // Check if token has expired
        if (profile.reset_token_expires_at && new Date(profile.reset_token_expires_at) < new Date()) {
            return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
        }

        // Update password using Supabase Admin API (handles hashing/encryption automatically)
        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
            profile.user_id,
            { password: password }
        );

        if (updateAuthError) {
            console.error('Error updating password:', updateAuthError);
            return res.status(500).json({ error: 'Failed to update password. Please try again.' });
        }

        // Clear the reset token
        const { error: clearError } = await supabase
            .from('user_profiles')
            .update({
                reset_token: null,
                reset_token_expires_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', profile.user_id);

        if (clearError) {
            console.error('Error clearing reset token:', clearError);
            // Password was still updated, so don't fail
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
