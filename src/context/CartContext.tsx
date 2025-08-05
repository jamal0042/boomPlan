// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Ticket, Event } from '../types'; // Assurez-vous que Event est importé si nécessaire pour Ticket
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (ticket: Ticket, quantity: number) => void;
  removeFromCart: (ticketId: number) => void;
  updateQuantity: (ticketId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number; // C'est la fonction que Navbar doit appeler
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (ticket: Ticket, quantity: number) => {
    setItems(current => {
      const existingItem = current.find(item => item.ticket_id === ticket.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const availableQuantity = ticket.quantity_total - ticket.quantity_sold;
        
        if (newQuantity > availableQuantity) {
          toast.error(`Only ${availableQuantity} tickets available`);
          return current;
        }
        
        return current.map(item =>
          item.ticket_id === ticket.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      const availableQuantity = ticket.quantity_total - ticket.quantity_sold;
      if (quantity > availableQuantity) {
        toast.error(`Only ${availableQuantity} tickets available`);
        return current;
      }
      
      toast.success('Ticket ajouter dans le panier');
      return [...current, { ticket_id: ticket.id, ticket, quantity }];
    });
  };

  const removeFromCart = (ticketId: number) => {
    setItems(current => current.filter(item => item.ticket_id !== ticketId));
    toast.success('Ticket supprimer dans le panier');
  };

  const updateQuantity = (ticketId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(ticketId);
      return;
    }

    setItems(current =>
      current.map(item => {
        if (item.ticket_id === ticketId) {
          const availableQuantity = item.ticket.quantity_total - item.ticket.quantity_sold;
          if (quantity > availableQuantity) {
            toast.error(`Only ${availableQuantity} tickets available`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.ticket.price * item.quantity), 0);
  };

  const getTotalItems = () => { // Implémentation de la fonction getTotalItems
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems, // Assurez-vous qu'elle est bien exportée dans le contexte
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
