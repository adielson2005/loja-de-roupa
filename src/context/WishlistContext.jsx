import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast.error('Produto já está nos favoritos');
        return prev;
      }
      toast.success('Adicionado aos favoritos!');
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        promoPrice: product.promoPrice,
        image: product.images?.[0] || product.image,
        category: product.category
      }];
    });
  }, [setWishlist]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter(item => item.id !== productId));
    toast.success('Removido dos favoritos');
  }, [setWishlist]);

  const toggleWishlist = useCallback((product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast.success('Favoritos limpos');
  }, [setWishlist]);

  const getWishlistCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      getWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
