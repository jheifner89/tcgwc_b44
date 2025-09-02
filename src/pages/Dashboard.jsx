import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, FileText, Truck } from 'lucide-react'
import { db } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    invoices: 0,
    shipments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [products, orders, invoices, shipments] = await Promise.all([
        db.getProducts(),
        db.getOrders(),
        db.getInvoices(),
        db.getShipments()
      ])

      setStats({
        products: products.data?.length || 0,
        orders: orders.data?.length || 0,
        invoices: invoices.data?.length || 0,
        shipments: shipments.data?.length || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      description: 'Active products in catalog'
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      description: 'Total orders placed'
    },
    {
      title: 'Invoices',
      value: stats.invoices,
      icon: FileText,
      description: 'Invoices generated'
    },
    {
      title: 'Shipments',
      value: stats.shipments,
      icon: Truck,
      description: 'Packages shipped'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
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
        <p className="text-gray-600 mt-2">Welcome to your Base44 management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <CardDescription className="text-xs">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System initialized</p>
                  <p className="text-xs text-gray-500">Database tables created successfully</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ready for data</p>
                  <p className="text-xs text-gray-500">Start adding products and managing orders</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Add Products</h4>
                <p className="text-xs text-gray-600">Start by adding products to your catalog</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Create Orders</h4>
                <p className="text-xs text-gray-600">Process customer orders and track fulfillment</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Generate Invoices</h4>
                <p className="text-xs text-gray-600">Create and send invoices to customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}