// Orders Management Component
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useSeller } from '../hooks/useSeller';
import { Order } from '../types/order';
import SellerLayout from './SellerLayout';

const Orders = () => {
    const { user } = useAuth();
    const { seller: sellerProfile, loading: sellerLoading } = useSeller();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetchOrders = useCallback(async () => {
        if (!sellerProfile) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          id,
          user_id,
          total,
          status,
          created_at,
          customer_email,
          customer_name,
          order_items ( id, product_id, name, price, quantity )
        `)
                .eq('seller_id', sellerProfile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedOrders: Order[] = (data || []).map((order: any) => ({
                id: order.id,
                userId: order.user_id,
                items: order.order_items || [],
                total: order.total,
                status: order.status,
                createdAt: new Date(order.created_at),
                customerEmail: order.customer_email,
                customerName: order.customer_name,
            }));

            setOrders(transformedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [sellerProfile]);

    useEffect(() => {
        if (!sellerLoading && sellerProfile) {
            fetchOrders();
        } else if (!sellerLoading && !sellerProfile) {
            setLoading(false);
        }
    }, [fetchOrders, sellerLoading, sellerProfile]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            alert(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update status.');
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (loading) {
        return (
            <SellerLayout title="Orders">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Orders">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Order Management</h2>
                        <p className="text-sm text-gray-500 font-medium">Track and process your incoming sales</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                            <p className="text-sm font-bold text-gray-900 font-mono">#{order.id.split('-')[0].toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</p>
                                            <p className="text-sm font-bold text-gray-900">{order.createdAt.toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</p>
                                            <p className="text-sm font-black text-purple-600">₹{order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items Summary</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                                    <span className="text-sm font-bold text-gray-700">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                                                    <span className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer & status</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {order.customerName?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{order.customerEmail}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className="flex-1 rounded-xl border-gray-100 bg-gray-50/50 p-3 text-xs font-black uppercase tracking-widest focus:ring-purple-500 focus:border-purple-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium italic">No orders found matching this criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
};

export default Orders;
