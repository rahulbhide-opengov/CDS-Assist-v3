/**
 * Cart Context
 *
 * Global state management for unified cart experience
 * Persists across all portal pages
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface CartItem {
  id: string;
  type: 'bill' | 'tax' | 'permit' | 'license' | 'park_pass' | 'facility_reservation' | 'utility' | 'fee';
  title: string;
  description: string;
  amount: number;
  accountId?: string;
  accountNumber?: string;
  dueDate?: string;
  metadata?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (accountId: string, type: CartItem['type']) => boolean;
  total: number;
  subtotal: number;
  convenienceFee: number;
  itemCount: number;
}

// ============================================================================
// CONTEXT
// ============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('unified-portal-cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('unified-portal-cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Sync cart across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'unified-portal-cart' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setItems(parsed);
        } catch (error) {
          console.error('Error syncing cart across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((i) => i.id === item.id);

      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }

      // Add new item
      return [...prev, item];
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all items
  const clearCart = () => {
    setItems([]);
  };

  // Open cart drawer
  const openCart = () => {
    setIsOpen(true);
  };

  // Close cart drawer
  const closeCart = () => {
    setIsOpen(false);
  };

  // Check if item is in cart (by account ID and type)
  const isInCart = (accountId: string, type: CartItem['type']) => {
    return items.some(item => item.accountId === accountId && item.type === type);
  };

  // Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  // Calculate convenience fee (2.5% for card payments - will be determined by payment method in drawer)
  // For now we show it as 0 in the cart, actual fee shown in payment step
  const convenienceFee = 0;

  const total = subtotal + convenienceFee;

  const itemCount = items.length;

  const value: CartContextType = {
    items,
    isOpen,
    addItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    isInCart,
    total,
    subtotal,
    convenienceFee,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
