import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import OrderReceipt, { ReceiptData } from './OrderReceipt';
import { ShoppingBag, X, Download, Eye } from 'lucide-react';

interface OrderItem { id: string; name: string; price: number; quantity: number; }

interface CustomerOrder {
  id: string;
  receipt_number: string | null;
  total: number;
  discounted_total: number | null;
  discount: number | null;
  coupon: string | null;
  status: string;
  created_at: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string | null;
  payment_method: string | null;
  payment_status: string | null;
  estimated_delivery: string | null;
  tax: number | null;
  shipping_charge: number | null;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  order_items: OrderItem[];
}

const statusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped':   return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-amber-100 text-amber-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'paid':      return 'bg-green-100 text-green-700';
    default:          return 'bg-gray-100 text-gray-600';
  }
};

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders,          setOrders]         = useState<CustomerOrder[]>([]);
  const [loading,         setLoading]        = useState(true);
  const [error,           setError]          = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [emailSending,    setEmailSending]   = useState(false);
  const [emailStatus,     setEmailStatus]    = useState<'idle' | 'sent' | 'error'>('idle');

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select(`
          id, receipt_number, total, discounted_total, discount, coupon,
          status, created_at, customer_email, customer_name, customer_phone,
          shipping_address, payment_method, payment_status, estimated_delivery,
          tax, shipping_charge, razorpay_payment_id, razorpay_order_id,
          order_items ( id, name, price, quantity )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setOrders((data as CustomerOrder[]) || []);
    } catch (err: any) {
      console.error('[MyOrders] fetch error:', err);
      setError('Failed to load orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openReceipt = (order: CustomerOrder) => {
    const grandTotal = order.discounted_total != null
      ? order.discounted_total + (order.shipping_charge || 0)
      : order.total + (order.shipping_charge || 0);

    setSelectedReceipt({
      orderId:           order.id,
      receiptNumber:     order.receipt_number || `BB-${order.id.split('-')[0].toUpperCase()}`,
      orderDate:         new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      customerName:      order.customer_name  || user?.name || 'Customer',
      customerEmail:     order.customer_email || user?.email || '',
      customerPhone:     order.customer_phone ?? undefined,
      shippingAddress:   order.shipping_address ?? undefined,
      items:             order.order_items || [],
      subtotal:          order.total,
      discount:          order.discount ? order.total * order.discount : 0,
      couponCode:        order.coupon ?? undefined,
      tax:               order.tax || 0,
      shippingCharge:    order.shipping_charge || 0,
      grandTotal,
      paymentMethod:     order.payment_method  || 'Razorpay Online',
      paymentStatus:     order.payment_status  || 'paid',
      orderStatus:       order.status,
      estimatedDelivery: order.estimated_delivery
        ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        : undefined,
      razorpayPaymentId: order.razorpay_payment_id ?? undefined,
      razorpayOrderId:   order.razorpay_order_id   ?? undefined,
    });
    setEmailStatus('idle');
  };

  const sendReceiptEmail = async (receipt: ReceiptData) => {
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-receipt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receipt),
      });
      setEmailStatus(res.ok ? 'sent' : 'error');
    } catch { setEmailStatus('error'); }
    finally { setEmailSending(false); }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-honeybee-primary/20 border-t-honeybee-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-honeybee-primary/10 rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-honeybee-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">View and download your order receipts</p>
        </div>
      </div>

      {/* Email toasts */}
      {emailStatus === 'sent' && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold">
          ✅ Receipt emailed to {selectedReceipt?.customerEmail}
        </div>
      )}
      {emailStatus === 'error' && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold">
          ⚠ Email failed — try the "Email Receipt" button again.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
          <button onClick={fetchOrders} className="ml-3 underline font-semibold">Retry</button>
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-700 font-semibold mb-1">No orders yet</h3>
          <p className="text-gray-400 text-sm">Your order history will appear here after your first purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const grandTotal = order.discounted_total != null
              ? order.discounted_total + (order.shipping_charge || 0)
              : order.total + (order.shipping_charge || 0);
            const date = new Date(order.created_at).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            });
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-gray-50 bg-gray-50/40">
                  <div className="flex items-center gap-4">
                    <div className="bg-honeybee-primary/10 p-2.5 rounded-xl">
                      <ShoppingBag className="w-5 h-5 text-honeybee-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt</p>
                      <p className="text-sm font-bold text-gray-900 font-mono">
                        #{order.receipt_number || order.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-gray-900">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                      <p className="text-sm font-black text-honeybee-primary">₹{grandTotal.toFixed(2)}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((item, i) => (
                      <div key={item.id || i} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info line */}
                  {(order.shipping_charge || 0) > 0 && (
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>+ Shipping</span>
                      <span>₹{(order.shipping_charge || 0).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openReceipt(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Receipt
                    </button>
                    <button
                      onClick={() => { openReceipt(order); setTimeout(() => window.print(), 300); }}
                      className="flex items-center gap-2 px-4 py-2 bg-honeybee-secondary text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl my-8">
            <button
              onClick={() => { setSelectedReceipt(null); setEmailStatus('idle'); }}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors no-print"
            >
              <X className="w-5 h-5" />
            </button>
            <OrderReceipt
              data={selectedReceipt}
              onClose={() => { setSelectedReceipt(null); setEmailStatus('idle'); }}
              onEmailResend={() => sendReceiptEmail(selectedReceipt)}
              emailSending={emailSending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
