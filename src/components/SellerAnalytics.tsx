import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SellerAnalytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, avgOrderValue: 0 });
    const [recentOrders, setRecentOrders] = useState<{ date: string; count: number; revenue: number }[]>([]);

    const fetchAnalytics = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).single();
            if (seller) {
                const { data: orders } = await supabase.from('orders').select('total, created_at').eq('seller_id', seller.id);
                const { data: products } = await supabase.from('products').select('id').eq('seller_id', seller.id);
                const orderList = orders || [];
                const totalRevenue = orderList.reduce((s, o) => s + (o.total || 0), 0);
                setStats({ totalOrders: orderList.length, totalRevenue, totalProducts: products?.length || 0, avgOrderValue: orderList.length ? totalRevenue / orderList.length : 0 });

                const last7: { [k: string]: { count: number; revenue: number } } = {};
                for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); last7[d.toISOString().split('T')[0]] = { count: 0, revenue: 0 }; }
                orderList.forEach((o) => { const d = new Date(o.created_at).toISOString().split('T')[0]; if (last7[d]) { last7[d].count++; last7[d].revenue += o.total || 0; } });
                setRecentOrders(Object.entries(last7).map(([date, data]) => ({ date, ...data })));
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

    const navItems = [
        { path: '/applications', icon: '📊', label: 'Dashboard' },
        { path: '/earnings', icon: '💰', label: 'Earnings' },
        { path: '/orders', icon: '🛒', label: 'Orders' },
        { path: '/analytics', icon: '📈', label: 'Analytics', active: true },
        { path: '/products', icon: '📦', label: 'Products' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="font-semibold">Analytics</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <div className="w-64 bg-white h-full shadow-lg" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b flex justify-between items-center">
                                <span className="font-semibold">Menu</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-1">✕</button>
                            </div>
                            <nav className="p-2">
                                {navItems.map(item => (
                                    <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                        className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 ${item.active ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <span className="mr-3">{item.icon}</span> {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
                    <nav className="p-4">
                        {navItems.map(item => (
                            <button key={item.path} onClick={() => navigate(item.path)}
                                className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${item.active ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <span className="mr-3">{item.icon}</span> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 lg:p-6">
                    <h1 className="hidden lg:block text-2xl font-bold mb-6">Sales Analytics</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Total Orders</p>
                            <p className="text-xl lg:text-2xl font-bold">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Revenue</p>
                            <p className="text-xl lg:text-2xl font-bold">₹{stats.totalRevenue.toFixed(0)}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Products</p>
                            <p className="text-xl lg:text-2xl font-bold">{stats.totalProducts}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Avg Order</p>
                            <p className="text-xl lg:text-2xl font-bold">₹{stats.avgOrderValue.toFixed(0)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                        <h2 className="text-base lg:text-lg font-semibold mb-4">Last 7 Days</h2>
                        <div className="space-y-2">
                            {recentOrders.map((day) => (
                                <div key={day.date} className="flex items-center justify-between py-2 border-b text-sm">
                                    <span className="text-gray-600">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <div className="flex gap-4 lg:gap-8">
                                        <span className="text-gray-500">{day.count} orders</span>
                                        <span className="font-semibold">₹{day.revenue.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalytics;
