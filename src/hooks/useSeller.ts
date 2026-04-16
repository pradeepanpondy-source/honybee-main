import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export interface Seller {
    id: string;
    seller_id: string;
    user_id: string;
    is_approved: boolean;
    name: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    seller_type?: 'honey' | 'beehive';
    kyc_verified?: boolean;
    created_at: string;
}

export type SellerProfile = Seller;

export const useSeller = () => {
    const { user } = useAuth();
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSeller = useCallback(async () => {
        if (!user?.id) {
            setSeller(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        // 8-second hard timeout — prevents "Verifying registration status…" infinite loop
        const timer = setTimeout(() => {
            console.warn('[useSeller] Fetch timed out — stopping loading');
            setSeller(null);
            setLoading(false);
        }, 8000);

        try {
            const { data, error } = await supabase
                .from('sellers')
                .select('*')
                .eq('user_id', user.id)
                .single();

            clearTimeout(timer);

            if (error) {
                if (error.code === 'PGRST116') {
                    // "Not found" → not a seller yet, that's fine
                    setSeller(null);
                } else {
                    console.error('[useSeller] DB error:', error);
                    throw error;
                }
            } else {
                setSeller(data);
            }
        } catch (err: any) {
            clearTimeout(timer);
            console.error('[useSeller] Fetch error:', err);
            setError(err);
            setSeller(null);
        } finally {
            clearTimeout(timer);
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchSeller();
    }, [user?.id, fetchSeller]);

    return { seller, loading, error, refreshSeller: fetchSeller };
};
