import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/features/Auth/ProtectedRoute'
import Layout from '../components/layout/Layout/Layout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Main Pages
import Dashboard from '../pages/dashboard/Dashboard'
import Products from '../pages/products/Products'
import Categories from '../pages/categories/Categories'
import Brands from '../pages/brands/Brands'
import Units from '../pages/units/Units'
import Stores from '../pages/stores/Stores'
import Packages from '../pages/packages/Packages'
import Inventory from '../pages/inventory/Inventory'
import Orders from '../pages/orders/Orders'
import Customers from '../pages/customers/Customers'
import CustomerDetails from '../pages/customers/CustomerDetails'
import Invoices from '../pages/invoices/Invoices'
import InvoiceDetail from '../pages/invoices/InvoiceDetail'
import Reports from '../pages/reports/Reports'
import ReportDetails from '../pages/reports/ReportDetails'
import Plans from '../pages/billing/Plans'
import BillGenerate from '../pages/bill-generate/BillGenerate'
import Settings from '../pages/settings/Settings'

// Test Page
import APITest from '../components/test/APITest'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Test Route */}
      <Route path="/test-api" element={<APITest />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/units" element={<Units />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/stock" element={<ProtectedRoute feature="stock-management"><Inventory /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute feature="hide-with-stock"><Orders /></ProtectedRoute>} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/detail/:id" element={<InvoiceDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route path="/invoice" element={<BillGenerate />} />
          <Route path="/billing" element={<Plans />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      
      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes