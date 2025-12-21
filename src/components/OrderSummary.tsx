import React from 'react';
import { Order } from '../types/order';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 mt-2">Ordered on: {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
          <div className="space-y-2">
            {order.customerName && (
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
            )}
            {order.customerEmail && (
              <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Total Items:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            {order.coupon && (
              <p><span className="font-medium">Coupon Used:</span> {order.coupon}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
          {order.discount && order.discountedTotal && (
            <>
              <div className="flex justify-between text-green-600">
                <span>Discount ({(order.discount * 100).toFixed(0)}%):</span>
                <span>-₹{(order.total - order.discountedTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Paid:</span>
                <span>₹{order.discountedTotal.toFixed(2)}</span>
              </div>
            </>
          )}
          {!order.discount && (
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
