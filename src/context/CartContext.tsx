import React, { createContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prevItems, { ...product, quantity: 1 }];
          }
        });
      }
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[$₹]/g, ''));
      return total + (price * item.quantity);
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
