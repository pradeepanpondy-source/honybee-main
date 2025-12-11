import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SellerEarnings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [earnings, setEarnings] = useState({ totalEarnings: 0, pendingPayout: 0, completedPayouts: 0, thisMonthEarnings: 0 });
    const [transactions, setTransactions] = useState<{ id: string; total: number; status: string; created_at: string; customer_name: string }[]>([]);

    const fetchEarnings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).single();
            if (seller) {
                const { data: orders } = await supabase.from('orders').select('id, total, status, created_at, customer_name').eq('seller_id', seller.id).order('created_at', { ascending: false });
                const orderList = orders || [];
                const total = orderList.reduce((s, o) => s + (o.total || 0), 0);
                const pending = orderList.filter(o => o.status === 'pending' || o.status === 'processing').reduce((s, o) => s + (o.total || 0), 0);
                const completed = orderList.filter(o => o.status === 'delivered' || o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0);
                const thisMonth = new Date(); thisMonth.setDate(1);
                const thisMonthEarnings = orderList.filter(o => new Date(o.created_at) >= thisMonth).reduce((s, o) => s + (o.total || 0), 0);
                setEarnings({ totalEarnings: total, pendingPayout: pending, completedPayouts: completed, thisMonthEarnings });
                setTransactions(orderList.slice(0, 10));
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

    const navItems = [
        { path: '/applications', icon: '📊', label: 'Dashboard' },
        { path: '/earnings', icon: '💰', label: 'Earnings', active: true },
        { path: '/orders', icon: '🛒', label: 'Orders' },
        { path: '/analytics', icon: '📈', label: 'Analytics' },
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
                <h1 className="font-semibold">Earnings</h1>
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
                    <h1 className="hidden lg:block text-2xl font-bold mb-6">Earnings & Payouts</h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Total Earnings</p>
                            <p className="text-xl lg:text-2xl font-bold text-green-600">₹{earnings.totalEarnings.toFixed(0)}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">This Month</p>
                            <p className="text-xl lg:text-2xl font-bold">₹{earnings.thisMonthEarnings.toFixed(0)}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Pending</p>
                            <p className="text-xl lg:text-2xl font-bold text-yellow-600">₹{earnings.pendingPayout.toFixed(0)}</p>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                            <p className="text-xs lg:text-sm text-gray-600">Completed</p>
                            <p className="text-xl lg:text-2xl font-bold">₹{earnings.completedPayouts.toFixed(0)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 lg:p-6 border-b"><h2 className="text-base lg:text-lg font-semibold">Recent Transactions</h2></div>

                        {/* Mobile view - Cards */}
                        <div className="lg:hidden divide-y">
                            {transactions.length > 0 ? transactions.map((o) => (
                                <div key={o.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium">#{o.id.slice(0, 8)}</p>
                                            <p className="text-sm text-gray-500">{o.customer_name || 'N/A'}</p>
                                        </div>
                                        <p className="font-semibold">₹{o.total?.toFixed(0)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>{o.status}</span>
                                    </div>
                                </div>
                            )) : <div className="p-4 text-center text-gray-500">No transactions</div>}
                        </div>

                        {/* Desktop view - Table */}
                        <table className="hidden lg:table w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.length > 0 ? transactions.map((o) => (
                                    <tr key={o.id}>
                                        <td className="px-6 py-4 text-sm">#{o.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 text-sm">{o.customer_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>{o.status}</span></td>
                                        <td className="px-6 py-4 text-sm font-semibold">₹{o.total?.toFixed(0)}</td>
                                    </tr>
                                )) : <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerEarnings;
