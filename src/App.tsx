import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/add" element={<AddCustomer />} />
            <Route path="customers/edit/:id" element={<AddCustomer />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            <Route path="invoices/edit/:id" element={<CreateInvoice />} />
            <Route path="invoices/view/:id" element={<ViewInvoice />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;