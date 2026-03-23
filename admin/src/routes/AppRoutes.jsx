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
import Units from '../pages/units/Units'
import Stores from '../pages/stores/Stores'
import Inventory from '../pages/inventory/Inventory'
import Orders from '../pages/orders/Orders'
import Customers from '../pages/customers/Customers'
import Invoices from '../pages/invoices/Invoices'
import Billing from '../pages/billing/Billing'
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
          <Route path="/units" element={<Units />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stock" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      
      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes