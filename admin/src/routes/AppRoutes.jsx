import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/features/Auth/ProtectedRoute'
import Layout from '../components/layout/Layout/Layout'

// Auth Pages
import Login from '../pages/auth/Login'

// Main Pages
import Dashboard from '../pages/dashboard/Dashboard'
import Products from '../pages/products/Products'
import DeletedProducts from '../pages/products/DeletedProducts'
import ProductDetails from '../pages/products/ProductDetails'
import Categories from '../pages/categories/Categories'
import Brands from '../pages/brands/Brands'
import Units from '../pages/units/Units'
import MedicineTypes from '../pages/medicine-types/MedicineTypes'
import Stores from '../pages/stores/Stores'
import Packages from '../pages/packages/Packages'
import Inventory from '../pages/inventory/Inventory'
import Orders from '../pages/orders/Orders'
import Customers from '../pages/customers/Customers'
import CustomerDetails from '../pages/customers/CustomerDetails'
import TrashedCustomers from '../pages/customers/TrashedCustomers'
import Invoices from '../pages/invoices/Invoices'
import InvoiceDetail from '../pages/invoices/InvoiceDetail'
import Reports from '../pages/reports/Reports'
import ReportDetails from '../pages/reports/ReportDetails'
import Plans from '../pages/billing/Plans'
import GstManagement from '../pages/gst/GstManagement'
import Settings from '../pages/settings/Settings'
import Notifications from '../pages/notifications/Notifications'


// Test Page
import APITest from '../components/test/APITest'
import SocialLink from '../pages/social-link/SocialLink'
import Sellers from '../pages/seller/Sellers'
import SellerDetails from '../pages/seller/SellerDetails'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Test Route */}
      <Route path="/test-api" element={<APITest />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProtectedRoute feature="products"><Products /></ProtectedRoute>} />
        <Route path="products/deleted" element={<ProtectedRoute feature="products"><DeletedProducts /></ProtectedRoute>} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="categories" element={<ProtectedRoute feature="categories"><Categories /></ProtectedRoute>} />
        <Route path="brands" element={<Brands />} />
        <Route path="units" element={<ProtectedRoute feature="units"><Units /></ProtectedRoute>} />
        <Route path="medicine-types" element={<MedicineTypes />} />
        <Route path="stores" element={<ProtectedRoute feature="stores"><Stores /></ProtectedRoute>} />
        <Route path="packages" element={<Packages />} />
        <Route path="stock" element={<ProtectedRoute feature="stock-management"><Inventory /></ProtectedRoute>} />
        <Route path="seller" element={<ProtectedRoute feature="seller"><Sellers /></ProtectedRoute>} />
        <Route path="seller/:id" element={<ProtectedRoute feature="seller"><SellerDetails /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute feature="orders"><Orders /></ProtectedRoute>} />
        <Route path="customers" element={<ProtectedRoute feature="customers"><Customers /></ProtectedRoute>} />
        <Route path="customers/trashed" element={<ProtectedRoute feature="customers"><TrashedCustomers /></ProtectedRoute>} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="invoices" element={<ProtectedRoute feature="invoices"><Invoices /></ProtectedRoute>} />
        <Route path="invoices/detail/:id" element={<InvoiceDetail />} />
        <Route path="reports" element={<ProtectedRoute feature="reports"><Reports /></ProtectedRoute>} />
        <Route path="reports/:id" element={<ReportDetails />} />
        <Route path="billing" element={<ProtectedRoute feature="billing"><Plans /></ProtectedRoute>} />
        <Route path="gst" element={<ProtectedRoute feature="gst"><GstManagement /></ProtectedRoute>} />
        <Route path="social-link" element={<ProtectedRoute feature="social-link"><SocialLink /></ProtectedRoute>} />
        <Route path="notifications" element={<Notifications />} />



        <Route path="settings" element={<ProtectedRoute feature="settings"><Settings /></ProtectedRoute>} />
      </Route>
      
      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes