import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/supabase'
import Layout from '@/components/Layout'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/pages/Dashboard'

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
          <Route path="/products" element={<div>Products - Coming Soon</div>} />
          <Route path="/orders" element={<div>Orders - Coming Soon</div>} />
          <Route path="/invoices" element={<div>Invoices - Coming Soon</div>} />
          <Route path="/requests" element={<div>Requests - Coming Soon</div>} />
          <Route path="/messages" element={<div>Messages - Coming Soon</div>} />
          <Route path="/shipments" element={<div>Shipments - Coming Soon</div>} />
          <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App