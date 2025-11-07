import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types/order';
import VerificationVideo from '../assets/Aadhaar Scan.webm';


const Applications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasApplication, setHasApplication] = useState<boolean | null>(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [kycFormData, setKycFormData] = useState({
    idType: 'Adhaar' as 'Adhaar' | 'Passport',
    idNumber: '',
    address: '',
    pincode: '',
    frontSide: null as File | null,
    backSide: null as File | null,
  });

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append('idType', kycFormData.idType);
      formData.append('idNumber', kycFormData.idNumber);
      formData.append('address', kycFormData.address);
      formData.append('pincode', kycFormData.pincode);
      if (kycFormData.frontSide) {
        formData.append('frontSide', kycFormData.frontSide);
      }
      if (kycFormData.backSide) {
        formData.append('backSide', kycFormData.backSide);
      }

      const response = await fetch('http://localhost/backend/api/kyc.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setKycVerified(true);
        alert('KYC submitted successfully!');
      } else {
        alert(data.message || 'Error submitting KYC. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('Error submitting KYC. Please try again.');
    }
  };

  useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';

    if (user || isGuest) {
      const checkApplication = async () => {
        if (user) {
          try {
            const response = await fetch('http://localhost:8000/backend/api/seller_application.php', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const data = await response.json();
            if (response.ok && data.hasApplication) {
              setHasApplication(true);
              setKycVerified(data.kycVerified || false);
            } else {
              setHasApplication(false);
            }
          } catch (error) {
            console.error('Error checking application:', error);
            setHasApplication(false);
          } finally {
            setLoading(false);
          }
        } else if (isGuest) {
          // For guests, check local storage
          const guestApplication = localStorage.getItem('guestSellerApplication');
          setHasApplication(guestApplication ? true : false);
          setKycVerified(true); // Assume guests are verified or skip KYC
          setLoading(false);
        }
      };
      checkApplication();

      // Fetch orders for the seller (only if user, guests might not have orders)
      if (user) {
        const fetchOrders = async () => {
          try {
            const response = await fetch('http://localhost:8000/backend/api/orders.php', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const data = await response.json();
            if (response.ok) {
              const ordersData: Order[] = data.orders || [];
              let sales = 0;
              let orderCount = 0;
              const productSet = new Set<string>();

              ordersData.forEach((order: Order) => {
                sales += order.total || 0;
                orderCount += 1;
                order.items.forEach(item => productSet.add(item.id.toString()));
              });

              setOrders(ordersData);
              setTotalSales(sales);
              setTotalOrders(orderCount);
              setActiveProducts(productSet.size);
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
        fetchOrders();
      }
    } else {
      setLoading(false);
      setHasApplication(false);
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Allow access for all users (authenticated or guest)

  if (!hasApplication) {
    return null; // Redirect handled by Seller component
  }

  // Dashboard for approved sellers - Replicated from provided image
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
          <button onClick={async () => { await logout(); navigate('/'); }} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">🚪</span> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {!kycVerified && (
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
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Golden Batch</p>
                  <p className="text-2xl font-bold text-gray-900">Yes</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Overview Orders</h3>
                <div className="flex space-x-2 text-sm">
                  <button className="text-purple-600 border-b-2 border-purple-600 pb-1">Monthly</button>
                  <button className="text-gray-500">Weekly</button>
                  <button className="text-gray-500">Daily</button>
                </div>
              </div>
              <div className="flex space-x-2 text-sm mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Completed</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Cancelled</span>
              </div>
              {/* Simple bar chart representation */}
              <div className="flex justify-between items-end h-32 space-x-1">
                <div className="bg-blue-500 h-3/4 w-4 rounded"></div>
                <div className="bg-blue-500 h-1/2 w-4 rounded"></div>
                <div className="bg-red-500 h-4/5 w-4 rounded"></div>
                <div className="bg-blue-500 h-2/3 w-4 rounded"></div>
                <div className="bg-red-500 h-1/4 w-4 rounded"></div>
                <div className="bg-blue-500 h-5/6 w-4 rounded"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New order received</span>
                  <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Product updated</span>
                  <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Payment processed</span>
                  <span className="text-xs text-gray-400 ml-auto">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

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

      {/* KYC Popup */}
      {showKycPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden flex">
            {/* Video Side */}
            <div className="w-1/2 p-8 flex items-center justify-center">
              <video
                src={VerificationVideo}
                autoPlay
                loop
                muted
                className="w-80 h-80 object-contain rounded-lg"
              />
            </div>
            {/* Form Side */}
            <div className="w-1/2 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">KYC Verification</h1>
                <button
                  onClick={() => setShowKycPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleKycSubmit} className="space-y-6">
                <div>
                  <div className="flex space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setKycFormData({ ...kycFormData, idType: 'Adhaar' })}
                      className={`flex-1 py-2 px-4 rounded-md border ${kycFormData.idType === 'Adhaar' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'border-gray-300 text-gray-700'}`}
                    >
                      Adhaar
                    </button>
                    <button
                      type="button"
                      onClick={() => setKycFormData({ ...kycFormData, idType: 'Passport' })}
                      className={`flex-1 py-2 px-4 rounded-md border ${kycFormData.idType === 'Passport' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'border-gray-300 text-gray-700'}`}
                    >
                      Passport
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter ID Number</label>
                  <input
                    type="text"
                    value={kycFormData.idNumber}
                    onChange={(e) => setKycFormData({ ...kycFormData, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your ID number"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">We will only store the last 4 digits of your ID proof</p>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address (Same as in KYC document)</label>
                  <textarea
                    value={kycFormData.address}
                    onChange={(e) => setKycFormData({ ...kycFormData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    placeholder="Enter your address"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">The address details should match with the uploaded KYC. Mismatch leads to shipment return as per customs regulations.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={kycFormData.pincode}
                    onChange={(e) => setKycFormData({ ...kycFormData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter pincode"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID</label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Upload Front Side</label>
                      <input
                        type="file"
                        onChange={(e) => setKycFormData({ ...kycFormData, frontSide: e.target.files ? e.target.files[0] : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        accept="image/*,.pdf"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (1MB Max)</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Upload Back Side</label>
                      <input
                        type="file"
                        onChange={(e) => setKycFormData({ ...kycFormData, backSide: e.target.files ? e.target.files[0] : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        accept="image/*,.pdf"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (1MB Max)</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white py-3 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium"
                >
                  Verify
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
