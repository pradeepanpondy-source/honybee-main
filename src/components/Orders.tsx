import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types/order';

const Orders: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch('http://localhost/backend/api/orders.php', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (response.ok && data.orders) {
            setOrders(data.orders);
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Allow access for all users (authenticated or guest)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-purple-700">HoneyBee</h2>
        </div>
        <nav className="mt-4">
          <button onClick={() => navigate('/seller')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">🏪</span> Seller
          </button>
          <button onClick={() => navigate('/applications')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">📊</span> Dashboard
          </button>
          <button onClick={() => navigate('/earnings')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">💰</span> Earnings
          </button>
          <button onClick={() => navigate('/orders')} className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded">
            <span className="mr-3">🛒</span> Orders
          </button>
          <button onClick={() => navigate('/analytics')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">📈</span> Analytics
          </button>
          <button onClick={() => navigate('/products')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">📦</span> Products
          </button>
          <button onClick={() => navigate('/settings')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">⚙️</span> Settings
          </button>
          <button onClick={async () => { await logout(); navigate('/'); }} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">🚪</span> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
                <div className="flex space-x-2">
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                  <button className="bg-purple-700 text-white px-4 py-1 rounded text-sm hover:bg-purple-800">Export</button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(-4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.map(item => item.name).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName || order.customerEmail || 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
