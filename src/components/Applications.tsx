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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [kycData, setKycData] = useState({
    idType: 'Adhaar',
    idNumber: '',
    address: '',
    pincode: '',
  });
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  // Product Form State
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
  });
  const [productSubmitting, setProductSubmitting] = useState(false);



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

      // Fetch KYC status
      const { data: kycData, error: kycError } = await supabase
        .from('kyc')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (kycError && kycError.code !== 'PGRST116') {
        console.error('KYC fetch error:', kycError);
      }
      if (kycData) {
        setKycStatus(kycData.status as 'pending' | 'approved' | 'rejected');
      } else {
        setKycStatus('none');
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

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setKycSubmitting(true);
    try {
      const { error } = await supabase.from('kyc').insert({
        user_id: user.id,
        id_type: kycData.idType,
        id_number: kycData.idNumber.slice(-4), // Store only last 4 digits
        address: kycData.address,
        pincode: kycData.pincode,
        status: 'pending',
      });
      if (error) throw error;
      alert('KYC submitted successfully! It will be reviewed shortly.');
      setShowKycPopup(false);
      setKycData({ idType: 'Adhaar', idNumber: '', address: '', pincode: '' });
    } catch (error: unknown) {
      console.error('KYC submission error:', error);
      alert(`KYC submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setKycSubmitting(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerProfile) {
      alert('You must be a registered seller to add products.');
      return;
    }
    setProductSubmitting(true);
    try {
      const { error } = await supabase.from('products').insert({
        seller_id: sellerProfile.id,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        stock: parseInt(productData.stock, 10),
        image_url: productData.image_url,
        is_active: true,
      });
      if (error) throw error;
      alert('Product added successfully!');
      setShowProductForm(false);
      setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
      fetchDashboardData();
    } catch (error: unknown) {
      console.error('Product submission error:', error);
      alert(`Product submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProductSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Navigation items for reuse
  const navItems = [
    { path: '/applications', icon: '📊', label: 'Dashboard', active: true },
    { path: '/earnings', icon: '💰', label: 'Earnings' },
    { path: '/orders', icon: '🛒', label: 'Orders' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/products', icon: '📦', label: 'Products' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="font-semibold">Dashboard</h1>
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
          {kycStatus === 'none' && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 lg:p-4 mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-sm lg:text-base">KYC Verification Required</p>
                  <p className="text-xs lg:text-sm">Complete KYC to unlock all features.</p>
                </div>
                <button
                  onClick={() => setShowKycPopup(true)}
                  className="bg-red-200 text-red-800 px-3 py-2 rounded hover:bg-red-300 text-sm whitespace-nowrap"
                >
                  Complete KYC
                </button>
              </div>
            </div>
          )}
          {kycStatus === 'pending' && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 lg:p-4 mb-4 lg:mb-6">
              <p className="font-bold text-sm lg:text-base">KYC Verification Pending</p>
              <p className="text-xs lg:text-sm">Your documents are under review (1-2 business days).</p>
            </div>
          )}
          {kycStatus === 'approved' && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 lg:p-4 mb-4 lg:mb-6">
              <p className="font-bold text-sm lg:text-base">KYC Verified ✓</p>
              <p className="text-xs lg:text-sm">Your account is fully verified.</p>
            </div>
          )}
          {kycStatus === 'rejected' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 lg:p-4 mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-bold text-sm lg:text-base">KYC Verification Rejected</p>
                  <p className="text-xs lg:text-sm">Please submit again with correct documents.</p>
                </div>
                <button
                  onClick={() => setShowKycPopup(true)}
                  className="bg-red-200 text-red-800 px-3 py-2 rounded hover:bg-red-300 text-sm whitespace-nowrap"
                >
                  Resubmit KYC
                </button>
              </div>
            </div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
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
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
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
        </div>\n      </div>

      {/* KYC Popup */}
      {showKycPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Complete KYC Verification</h2>
              <button onClick={() => setShowKycPopup(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {/* KYC Animation Video */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <video
                src="/kyc.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-32 object-cover"
              />
            </div>
            <form onSubmit={handleKycSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Type</label>
                <select
                  value={kycData.idType}
                  onChange={(e) => setKycData({ ...kycData, idType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
                >
                  <option value="Adhaar">Adhaar Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <input
                  type="text"
                  value={kycData.idNumber}
                  onChange={(e) => setKycData({ ...kycData, idNumber: e.target.value })}
                  required
                  placeholder="Enter your ID number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={kycData.address}
                  onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
                  required
                  placeholder="Enter your full address"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  value={kycData.pincode}
                  onChange={(e) => setKycData({ ...kycData, pincode: e.target.value })}
                  required
                  placeholder="Enter your pincode"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 p-2 border"
                />
              </div>
              <button
                type="submit"
                disabled={kycSubmitting}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:opacity-50"
              >
                {kycSubmitting ? 'Submitting...' : 'Submit KYC'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Form Popup */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setShowProductForm(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={productData.stock}
                      onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  >
                    <option value="">Select a category</option>
                    <option value="honey">Honey</option>
                    <option value="beehive">Beehive</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={productData.image_url}
                    onChange={(e) => setProductData({ ...productData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  />
                </div>
                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 disabled:opacity-50"
                >
                  {productSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
