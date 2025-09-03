import React, { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import StatsCards from '@/components/dashboard/StatsCards'
import SpendHistory from '@/components/dashboard/SpendHistory'
import MessageCenter from '@/components/dashboard/MessageCenter'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    invoices: 0,
    shipments: 0,
    messages: 0,
    totalSpent: 0
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [spendHistory, setSpendHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [products, orders, invoices, shipments, messages] = await Promise.all([
        db.getProducts(),
        db.getOrders(),
        db.getInvoices(),
        db.getShipments(),
        db.getMessages()
      ])

      // Calculate total spent from paid invoices
      const totalSpent = invoices.data?.reduce((sum, invoice) => {
        return invoice.status === 'paid' ? sum + (parseFloat(invoice.total_amount) || 0) : sum
      }, 0) || 0

      setStats({
        products: products.data?.length || 0,
        orders: orders.data?.length || 0,
        invoices: invoices.data?.length || 0,
        shipments: shipments.data?.length || 0,
        messages: messages.data?.filter(m => !m.is_read).length || 0,
        totalSpent
      })

      // Get recent unread messages
      setRecentMessages(messages.data?.filter(m => !m.is_read).slice(0, 5) || [])

      // Create spend history from paid invoices
      const paidInvoices = invoices.data?.filter(inv => inv.status === 'paid') || []
      const spendData = paidInvoices.map(invoice => ({
        id: invoice.id,
        date: invoice.paid_date || invoice.created_at,
        amount: parseFloat(invoice.total_amount) || 0,
        description: `Invoice ${invoice.invoice_number}`,
        type: 'invoice'
      })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

      setSpendHistory(spendData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your TCGWC management system</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendHistory totalSpent={stats.totalSpent} spendHistory={spendHistory} />
        <MessageCenter unreadCount={stats.messages} recentMessages={recentMessages} />
      </div>
    </div>
  )
}

      </div>
    </div>
  )
}