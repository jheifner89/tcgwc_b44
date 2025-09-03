import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, FileText, Truck } from 'lucide-react'

export default function StatsCards({ stats }) {
  const statCards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      description: 'Available products'
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      description: 'Total orders'
    },
    {
      title: 'Invoices',
      value: stats.invoices,
      icon: FileText,
      description: 'Generated invoices'
    },
    {
      title: 'Shipments',
      value: stats.shipments,
      icon: Truck,
      description: 'Active shipments'
    }
  ]

  return (
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
  )
}