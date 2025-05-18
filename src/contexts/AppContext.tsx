import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Customer, Invoice, AppSettings } from '../types';

interface AppContextType {
  customers: Customer[];
  invoices: Invoice[];
  settings: AppSettings;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Omit<Customer, 'id'>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => string;
  updateInvoice: (id: string, invoice: Omit<Invoice, 'id'>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  businessName: 'Your Business',
  businessAddress: '123 Business Street, City',
  businessEmail: 'business@example.com',
  businessPhone: '(123) 456-7890',
  businessLogo: '',
  signature: '',
  taxRate: {
    CGST: 9,
    SGST: 9,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = {
      id: uuidv4(),
      ...customer,
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customer: Omit<Customer, 'id'>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { id, ...customer } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const getCustomer = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const id = uuidv4();
    const newInvoice = {
      id,
      ...invoice,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [...prev, newInvoice]);
    return id;
  };

  const updateInvoice = (id: string, invoice: Omit<Invoice, 'id'>) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { id, ...invoice, createdAt: i.createdAt } : i))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  const getInvoice = (id: string) => {
    return invoices.find((i) => i.id === id);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value = {
    customers,
    invoices,
    settings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};