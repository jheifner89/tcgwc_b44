import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function MyShipments({ user }) {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadShipments()
  }, [])

  const loadShipments = async () => {
    try {
      const { data, error } = await db.getShipments()
      if (error) throw error
      setShipments(data || [])
    } catch (error) {
      console.error('Error loading shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'in_transit':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'returned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
        <p className="text-gray-600 mt-2">Track your shipments and delivery status.</p>
      </div>

      <div className="space-y-4">
        {shipments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No shipments found</h3>
                <p>You don't have any shipments yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          shipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Tracking: {shipment.tracking_number || 'Not assigned'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {shipment.carrier} • {formatDate(shipment.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(shipment.status)}`}>
                      {shipment.status?.replace('_', ' ') || 'preparing'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Shipping Method</p>
                    <p className="font-medium">{shipment.shipping_method || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shipped Date</p>
                    <p className="font-medium">
                      {shipment.shipped_date ? formatDate(shipment.shipped_date) : 'Not shipped'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">
                      {shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : 'TBD'}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Shipping Address:</strong> {shipment.shipping_address}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}