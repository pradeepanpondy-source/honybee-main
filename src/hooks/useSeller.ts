import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export interface SellerProfile {
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
}

export const useSeller = () => {
    const { user } = useAuth();
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSeller = useCallback(async () => {
        if (!user) {
            setSeller(null);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('sellers')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found is not an error in strict sense, just means not a seller
                    setSeller(null);
                } else {
                    throw error;
                }
            } else {
                setSeller(data);
            }
        } catch (err: any) {
            console.error('Error fetching seller:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchSeller();
    }, [fetchSeller]);

    return { seller, loading, error, refreshSeller: fetchSeller };
};
