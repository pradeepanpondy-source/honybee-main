import React, { createContext, useState, ReactNode } from 'react';
import { Product } from '../types/product'; // Import the correct Product type

// We also add quantity to it for the cart.
// We also add quantity to it for the cart.
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void; // Changed id to string
  updateQuantity: (id: string, quantity: number) => void; // Changed id to string
  clearCart: () => void;
  getTotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const isSubscription = product.name.includes('Subscription Plan');
    const hasSubscription = cartItems.some(item => item.name.includes('Subscription Plan'));

    if (isSubscription) {
      // Clear cart and add subscription
      setCartItems([{ ...product, quantity: 1 }]);
    } else {
      // Shop item
      if (hasSubscription) {
        // Don't add shop items if subscription is present
        return;
      } else {
        // Normal add for shop items
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          if (existingItem) {
            return prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, 5) }
                : item
            );
          } else {
            return [...prevItems, { ...product, quantity: 1 }];
          }
        });
      }
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const newQuantity = Math.min(quantity, 5);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    // The price from the main Product type is a number, so no parsing is needed.
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
