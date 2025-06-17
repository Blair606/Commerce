import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CogIcon,
  CreditCardIcon,
  TruckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useSettings } from '../../context/SettingsContext';

// Separate components for better organization
const CurrencySettings = () => {
  const { settings, updateSettings } = useSettings();
  const [mpesaConfig, setMpesaConfig] = useState({
    consumerKey: '',
    consumerSecret: '',
    passkey: '',
    shortcode: '',
    env: 'sandbox'
  });
  
  const [paypalConfig, setPaypalConfig] = useState({
    clientId: '',
    clientSecret: '',
    mode: 'sandbox'
  });

  const currencies = [
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(c => c.code === e.target.value);
    if (selectedCurrency) {
      updateSettings({
        currency: {
          ...settings.currency,
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol,
          name: selectedCurrency.name
        }
      });
    }
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const position = e.target.value as 'before' | 'after';
    updateSettings({
      currency: {
        ...settings.currency,
        position
      }
    });
  };

  const handleMpesaConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMpesaConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaypalConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaypalConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const savePaymentConfig = async () => {
    try {
      await updateSettings({
        paymentGateways: {
          mpesa: mpesaConfig,
          paypal: paypalConfig
        }
      });
      alert('Payment settings saved successfully');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert('Failed to save payment settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Currency</label>
            <select 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.currency.code}
              onChange={handleCurrencyChange}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency Position</label>
            <select 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.currency.position}
              onChange={handlePositionChange}
            >
              <option value="before">Before price ({settings.currency.symbol}100)</option>
              <option value="after">After price (100{settings.currency.symbol})</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-6">
          {/* M-Pesa Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src="/mpesa-logo.png" alt="M-Pesa" className="h-8 w-auto mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">M-Pesa</h4>
                  <p className="text-sm text-gray-500">Mobile money payments</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consumer Key</label>
                <input
                  type="text"
                  name="consumerKey"
                  value={mpesaConfig.consumerKey}
                  onChange={handleMpesaConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Consumer Secret</label>
                <input
                  type="password"
                  name="consumerSecret"
                  value={mpesaConfig.consumerSecret}
                  onChange={handleMpesaConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Passkey</label>
                <input
                  type="password"
                  name="passkey"
                  value={mpesaConfig.passkey}
                  onChange={handleMpesaConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shortcode</label>
                <input
                  type="text"
                  name="shortcode"
                  value={mpesaConfig.shortcode}
                  onChange={handleMpesaConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Environment</label>
                <select
                  name="env"
                  value={mpesaConfig.env}
                  onChange={handleMpesaConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>

          {/* PayPal Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src="/paypal-logo.png" alt="PayPal" className="h-8 w-auto mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">PayPal</h4>
                  <p className="text-sm text-gray-500">Credit card and PayPal payments</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client ID</label>
                <input
                  type="text"
                  name="clientId"
                  value={paypalConfig.clientId}
                  onChange={handlePaypalConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                <input
                  type="password"
                  name="clientSecret"
                  value={paypalConfig.clientSecret}
                  onChange={handlePaypalConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode</label>
                <select
                  name="mode"
                  value={paypalConfig.mode}
                  onChange={handlePaypalConfigChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={savePaymentConfig}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Payment Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-gray-700">Require 2FA for admin access</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
            <select className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Roles & Permissions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Administrator</h4>
              <p className="text-sm text-gray-500">Full access to all features</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Edit Permissions
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Manager</h4>
              <p className="text-sm text-gray-500">Can manage products and orders</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Edit Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Zones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Domestic Shipping</h4>
              <p className="text-sm text-gray-500">Standard shipping within country</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">International Shipping</h4>
              <p className="text-sm text-gray-500">Worldwide shipping options</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const { settings, updateSettings } = useSettings();

  const handleMaintenanceModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ maintenanceMode: e.target.checked });
  };

  const handleStoreHoursChange = (type: 'opening' | 'closing', value: string) => {
    updateSettings({
      storeHours: {
        ...settings.storeHours,
        [type]: value
      }
    });
  };

  const handleSiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ siteName: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.siteName}
              onChange={handleSiteNameChange}
              placeholder="Enter your site name"
            />
            <p className="mt-2 text-sm text-gray-500">
              This name will appear in the navigation bar and footer of your site.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-indigo-600">{settings.siteName}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              defaultValue="Your trusted online shopping destination"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={settings.maintenanceMode}
                  onChange={handleMaintenanceModeChange}
                />
                <span className="ml-2 text-gray-700">Enable maintenance mode</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Hours</label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500">Opening Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.storeHours.opening}
                  onChange={(e) => handleStoreHoursChange('opening', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Closing Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.storeHours.closing}
                  onChange={(e) => handleStoreHoursChange('closing', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'currency', name: 'Currency & Payments', icon: CurrencyDollarIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'users', name: 'User Roles', icon: UserGroupIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'currency':
        return <CurrencySettings />;
      case 'shipping':
        return <ShippingSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'users':
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
        Settings
      </h1>
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 