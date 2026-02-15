import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);

  const addToCart = useCallback((product, quantity = 1, size = null, color = null) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => 
          item.id === product.id && 
          item.size === size && 
          item.color === color
      );

      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        toast.success('Quantidade atualizada no carrinho!');
        return newItems;
      }

      toast.success('Produto adicionado ao carrinho!');
      return [...prevItems, { 
        ...product, 
        quantity, 
        size, 
        color,
        cartId: `${product.id}-${size}-${color}-${Date.now()}`
      }];
    });
  }, [setCartItems]);

  const removeFromCart = useCallback((cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
    toast.success('Produto removido do carrinho!');
  }, [setCartItems]);

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }, [setCartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.promoPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getCartDiscount = useCallback(() => {
    return cartItems.reduce((total, item) => {
      if (item.promoPrice) {
        return total + (item.price - item.promoPrice) * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartDiscount,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
