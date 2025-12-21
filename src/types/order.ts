export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  discountedTotal?: number;
  coupon?: string;
  discount?: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  customerEmail?: string;
  customerName?: string;
}
