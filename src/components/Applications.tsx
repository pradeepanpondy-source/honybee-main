import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [hasApplication, setHasApplication] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const checkApplication = async () => {
        try {
          const docRef = doc(db, 'sellerApplications', user.uid);
          const docSnap = await getDoc(docRef);
          setHasApplication(docSnap.exists());
        } catch (error) {
          console.error('Error checking application:', error);
          setHasApplication(false);
        } finally {
          setLoading(false);
        }
      };
      checkApplication();
    } else {
      setLoading(false);
      setHasApplication(false);
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-lg text-gray-600 mb-4">Please sign in to access your seller dashboard.</p>
            <a href="/profile" className="text-purple-700 underline">Go to Sign In</a>
          </div>
        </div>
      </div>
    );
  }

  if (!hasApplication) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-lg text-gray-600 mb-4">You haven't submitted a seller application yet.</p>
            <a href="/seller" className="text-purple-700 underline">Apply to become a seller</a>
          </div>
        </div>
      </div>
    );
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
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded">
            <span className="mr-3">📊</span> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">💰</span> Earnings
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">🛒</span> Orders
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">📈</span> Analytics
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">📦</span> Products
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">⚙️</span> Settings
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <span className="mr-3">🚪</span> Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                🔔
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Selling Price</p>
                  <p className="text-2xl font-bold text-gray-900">$2,110</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Click Price</p>
                  <p className="text-2xl font-bold text-gray-900">$1,912</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">20,182</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
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
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Honey Jar - 500g</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mar 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bee Hive Kit</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mar 14, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#003</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Royal Jelly</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mar 13, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bob Johnson</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;
