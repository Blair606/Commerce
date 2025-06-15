import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  currency: {
    code: string;
    symbol: string;
    name: string;
    position: 'before' | 'after';
  };
  maintenanceMode: boolean;
  storeHours: {
    opening: string;
    closing: string;
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  formatPrice: (price: number) => string;
}

const defaultSettings: Settings = {
  currency: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    position: 'before'
  },
  maintenanceMode: false,
  storeHours: {
    opening: '09:00',
    closing: '18:00'
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('storeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const formatPrice = (price: number) => {
    const { symbol, position } = settings.currency;
    return position === 'before' 
      ? `${symbol} ${price.toFixed(2)}`
      : `${price.toFixed(2)} ${symbol}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 