import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useSeller } from '../hooks/useSeller';
import SellerLayout from './SellerLayout';

const SellerEarnings = () => {
    const { user } = useAuth();
    const { seller: sellerProfile, loading: sellerLoading } = useSeller();
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [pendingPayout, setPendingPayout] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchEarningsData = useCallback(async () => {
        if (!sellerProfile) return;
        setLoading(true);
        try {
            // Fetch orders to calculate earnings
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('total, status, created_at')
                .eq('seller_id', sellerProfile.id)
                .eq('status', 'delivered');

            if (ordersError) throw ordersError;

            const total = (orders || []).reduce((acc: number, curr: any) => acc + curr.total, 0);
            setTotalEarnings(total);

            // Fetch pending orders (not yet delivered but not cancelled)
            const { data: pendingOrders, error: pendingError } = await supabase
                .from('orders')
                .select('total')
                .eq('seller_id', sellerProfile.id)
                .in('status', ['pending', 'processing', 'shipped']);

            if (pendingError) throw pendingError;
            const pending = (pendingOrders || []).reduce((acc: number, curr: any) => acc + curr.total, 0);
            setPendingPayout(pending);

            // Recent transactions (from delivered orders)
            setTransactions((orders || []).slice(0, 10).map(o => ({
                id: Math.random().toString(36).substr(2, 9),
                amount: o.total,
                date: new Date(o.created_at),
                type: 'Sale',
                status: 'Completed'
            })));

        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
        }
    }, [sellerProfile]);

    useEffect(() => {
        if (!sellerLoading && sellerProfile) {
            fetchEarningsData();
        } else if (!sellerLoading && !sellerProfile) {
            setLoading(false);
        }
    }, [fetchEarningsData, sellerLoading, sellerProfile]);

    if (loading) {
        return (
            <SellerLayout title="Earnings">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Earnings">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-4xl font-black text-gray-900 leading-none">₹{totalEarnings.toFixed(2)}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <span className="text-xs font-bold text-green-500">↑ 12% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Payout</p>
                        <p className="text-4xl font-black text-gray-900 leading-none">₹{pendingPayout.toFixed(2)}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <span className="text-xs font-bold text-gray-400 italic">Processing current cycle</span>
                        </div>
                    </div>

                    <div className="bg-purple-600 p-8 rounded-2xl shadow-xl shadow-purple-100 flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-1">Available for Withdrawal</p>
                        <p className="text-4xl font-black text-white leading-none">₹{totalEarnings.toFixed(2)}</p>
                        <button className="mt-4 w-full bg-white text-purple-600 font-black uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-purple-50 transition-colors">
                            Withdraw Now
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Transactions</h3>
                        <button className="text-xs font-bold text-purple-600 uppercase tracking-widest">Download Report</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900 font-mono">#TX-{tx.id.toUpperCase()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{tx.date.toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold uppercase text-[10px] tracking-widest">{tx.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{tx.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-0.5 inline-flex text-[10px] leading-5 font-black uppercase tracking-widest rounded-full bg-green-100 text-green-700">
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerEarnings;

