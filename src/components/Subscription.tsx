import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from './Button';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleChoosePlan = (planName: string, price: number) => {
    const planProduct = {
      id: planName === 'Basic' ? 'subscription-basic' : 'subscription-premium',
      name: `${planName} Subscription Plan`,
      description: `${planName} subscription plan for sellers`,
      price: price,
      category: 'subscription',
      image_url: planName === 'Basic' ? '/src/assets/basic.PNG' : '/src/assets/premium.PNG',
      seller_id: 'system',
      stock: 999,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addToCart(planProduct);
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan 1 */}
        <div className="group">
          <div className="bg-white rounded-lg shadow-lg animate-card-hover p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Basic</h3>
            <p className="text-4xl font-bold text-honeybee-primary mb-4">₹499</p>
            <ul className="text-left space-y-2 mb-6 text-gray-600">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Basic sales tracking</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 10% per sale</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Payment payouts 5-7 days</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Standard email Support</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Can rent up to 10 hive per month</li>
            </ul>
            <div className="group">
              <Button onClick={() => handleChoosePlan('Basic', 499)} className="px-8 py-3" variant="primary">Choose Plan</Button>
            </div>
          </div>
        </div>

        {/* Plan 2 */}
        <div className="group">
          <div className="bg-white rounded-lg shadow-lg animate-card-hover p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Premium</h3>
            <p className="text-4xl font-bold text-honeybee-primary mb-4">₹1299</p>
            <ul className="text-left space-y-2 mb-6 text-gray-600">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> AI insights: best-selling flavors, demand trends by region</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 5% per sale</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Instant payout</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Priority chat support</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Can rent unlimited hive per month</li>
            </ul>
            <div className="group">
              <Button onClick={() => handleChoosePlan('Premium', 1299)} className="px-8 py-3" variant="primary">Choose Plan</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;