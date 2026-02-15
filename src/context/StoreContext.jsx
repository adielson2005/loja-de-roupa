import { createContext, useContext, useState, useEffect } from 'react';
import { getStoreConfig } from '../services/api';
import { storeDefaults } from '../config/storeDefaults';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeConfig, setStoreConfig] = useState(storeDefaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreConfig();
  }, []);

  const loadStoreConfig = async () => {
    try {
      const response = await getStoreConfig();
      // A API retorna { success: true, data: config }
      const apiData = response.data?.data || response.data || {};
      const config = { ...storeDefaults, ...apiData };
      setStoreConfig(config);
      applyTheme(config);
    } catch (error) {
      console.log('Using default store config');
      applyTheme(storeDefaults);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (config) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.primaryColor);
    root.style.setProperty('--color-primary-dark', darkenColor(config.primaryColor, 20));
    root.style.setProperty('--color-secondary', config.secondaryColor);
    root.style.setProperty('--color-secondary-dark', darkenColor(config.secondaryColor, 20));
    
    // Update page title
    document.title = config.storeName;
  };

  const darkenColor = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  };

  const updateConfig = (newConfig) => {
    const config = { ...storeConfig, ...newConfig };
    setStoreConfig(config);
    applyTheme(config);
  };

  return (
    <StoreContext.Provider value={{ storeConfig, loading, updateConfig, refetch: loadStoreConfig }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
