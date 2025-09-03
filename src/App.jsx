import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/supabase'
import Layout from '@/components/Layout'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import AdminDashboard from '@/pages/AdminDashboard'
import MyRequests from '@/pages/MyRequests'
import MyInvoices from '@/pages/MyInvoices'
import MyOrders from '@/pages/MyOrders'
import MyShipments from '@/pages/MyShipments'
import Messages from '@/pages/Messages'
import Settings from '@/pages/Settings'
import { Toaster } from '@/components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/requests" element={<MyRequests user={user} />} />
          <Route path="/invoices" element={<MyInvoices user={user} />} />
          <Route path="/orders" element={<MyOrders user={user} />} />
          <Route path="/shipments" element={<MyShipments user={user} />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App