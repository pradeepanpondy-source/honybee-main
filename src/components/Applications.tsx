import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';

interface SellerProfile {
  id: string;
  user_id: string;
  is_approved: boolean;
  // Add other seller fields if needed
}

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);



  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch seller profile
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('id, user_id, is_approved')
        .eq('user_id', user.id)
        .single();

      if (sellerError && sellerError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw sellerError;
      }

    if (sellerData) {
      setSellerProfile(sellerData);

      // 2. Fetch products if seller exists
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerData.id);

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // 3. Fetch orders if seller exists
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          total,
          discounted_total,
          coupon,
          discount,
          status,
          created_at,
          customer_email,
          customer_name,
          order_items ( id, product_id, name, price, quantity )
        `)
        .eq('seller_id', sellerData.id);

      if (ordersError) throw ordersError;

      const transformedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        userId: order.user_id,
        items: order.order_items || [],
        total: order.total,
        discountedTotal: order.discounted_total,
        coupon: order.coupon,
        discount: order.discount,
        status: order.status,
        createdAt: new Date(order.created_at),
        customerEmail: order.customer_email,
        customerName: order.customer_name,
      }));

      let sales = 0;
      let orderCount = 0;
      transformedOrders.forEach(order => {
        sales += order.total || 0;
        orderCount += 1;
      });

      setOrders(transformedOrders);
      setTotalSales(sales);
      setTotalOrders(orderCount);
      setActiveProducts(productsData?.length || 0);

    }
    } catch (error: unknown) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleEditProduct = () => {
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!sellerProfile || !confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      alert('Product deleted successfully!');
      fetchDashboardData(); // Refresh all data
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      alert(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Main dashboard render
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
        </div>
        <nav className="mt-4">
          <button onClick={() => navigate('/applications')} className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded">
            <span className="mr-3">📊</span> Dashboard
          </button>
          <button onClick={() => navigate('/earnings')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">💰</span> Earnings
          </button>
          <button onClick={() => navigate('/orders')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">KYC Verification Required</p>
                <p>Please complete your KYC verification to unlock all features.</p>
              </div>
              <button
                onClick={() => setShowKycPopup(true)}
                className="bg-red-200 text-red-800 px-4 py-2 rounded hover:bg-red-300"
              >
                Complete KYC
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalSales.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval Status</p>
                  <p className={`text-2xl font-bold ${sellerProfile?.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                    {sellerProfile?.is_approved ? 'Approved' : 'Pending'}
                  </p>
                </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product(s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName || order.customerEmail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">My Products</h3>
                <button
                  onClick={() => {
                    setShowProductForm(true);
                  }}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Add Product
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button onClick={() => handleEditProduct()} className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No products found. Add one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* KYC Popup */}
      {showKycPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           {/* ... KYC form JSX ... */}
        </div>
      )}

      {/* Product Form Popup */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-8 overflow-y-auto">
              {/* ... Product form JSX ... */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
