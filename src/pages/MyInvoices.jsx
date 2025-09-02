import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function MyInvoices({ user }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const { data, error } = await db.getInvoices()
      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
        <p className="text-gray-600 mt-2">View and manage your invoices.</p>
      </div>

      <div className="space-y-4">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No invoices found</h3>
                <p>You don't have any invoices yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Invoice #{invoice.invoice_number}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {invoice.customer_name} • {formatDate(invoice.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status || 'draft'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="font-medium">{formatCurrency(invoice.subtotal || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tax</p>
                    <p className="font-medium">{formatCurrency(invoice.tax_amount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-medium text-lg">{formatCurrency(invoice.total_amount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {invoice.due_date ? formatDate(invoice.due_date) : 'Not set'}
                    </p>
                  </div>
                </div>

                {invoice.paid_date && (
                  <div className="text-xs text-gray-500">
                    Paid on: {formatDate(invoice.paid_date)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}