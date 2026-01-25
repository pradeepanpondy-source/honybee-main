import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSeller } from '../hooks/useSeller';
import SellerLayout from './SellerLayout';

const SellerAnalytics = () => {
    const { seller: sellerProfile, loading: sellerLoading } = useSeller();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        conversionRate: 3.2, // Mock data
        activeCustomers: 0
    });
    const [topProducts, setTopProducts] = useState<any[]>([]);

    const fetchAnalyticsData = useCallback(async () => {
        if (!sellerProfile) return;
        setLoading(true);
        try {
            // Fetch orders for revenue and order count
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('total, user_id')
                .eq('seller_id', sellerProfile.id);

            if (ordersError) throw ordersError;

            const revenue = (orders || []).reduce((acc: number, curr: any) => acc + curr.total, 0);
            const uniqueCustomers = new Set((orders || []).map(o => o.user_id)).size;

            setStats({
                totalRevenue: revenue,
                totalOrders: orders?.length || 0,
                conversionRate: 4.5,
                activeCustomers: uniqueCustomers
            });

            // Fetch top products (mock logic for now based on all products)
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('name, price, stock')
                .eq('seller_id', sellerProfile.id)
                .limit(5);

            if (productsError) throw productsError;
            setTopProducts(products || []);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [sellerProfile]);

    useEffect(() => {
        if (!sellerLoading && sellerProfile) {
            fetchAnalyticsData();
        } else if (!sellerLoading && !sellerProfile) {
            setLoading(false);
        }
    }, [fetchAnalyticsData, sellerLoading, sellerProfile]);

    if (loading) {
        return (
            <SellerLayout title="Analytics">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Analytics">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                        <p className="text-3xl font-black text-gray-900">{stats.conversionRate}%</p>
                        <div className="mt-2 text-xs font-bold text-green-500">↑ 0.4% this week</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Customers</p>
                        <p className="text-3xl font-black text-gray-900">{stats.activeCustomers}</p>
                        <div className="mt-2 text-xs font-bold text-purple-500">Loyal fan base</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Order Value</p>
                        <p className="text-3xl font-black text-gray-900">₹{(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}</p>
                        <div className="mt-2 text-xs font-bold text-gray-400 italic">Per transaction</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Volume</p>
                        <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                        <div className="mt-2 text-xs font-bold text-blue-500">Growing steady</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Sales Performance</h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[45, 60, 40, 75, 90, 65, 80].map((val, i) => (
                                <div key={i} className="flex-1 space-y-2">
                                    <div
                                        style={{ height: `${val}%` }}
                                        className="w-full bg-purple-600 rounded-lg shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all cursor-pointer group relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ₹{(val * 100).toFixed(0)}
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 text-center uppercase">Day {i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Top Products</h3>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? topProducts.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600 text-[10px]">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-900">₹{p.price.toFixed(2)}</p>
                                </div>
                            )) : (
                                <p className="text-gray-400 italic text-center py-12">No data available yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
};

export default SellerAnalytics;
