import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ExternalLink, Package } from 'lucide-react'
import { db } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function MyShipments({ user }) {
  const [shipments, setShipments] = useState([])
  const [filteredShipments, setFilteredShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [carrierFilter, setCarrierFilter] = useState('all')

  useEffect(() => {
    loadShipments()
  }, [])

  useEffect(() => {
    filterShipments()
  }, [shipments, searchTerm, statusFilter, carrierFilter])

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

  const filterShipments = () => {
    let filtered = shipments

    if (searchTerm) {
      filtered = filtered.filter(shipment =>
        shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.carrier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.orders?.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter)
    }

    if (carrierFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.carrier === carrierFilter)
    }

    setFilteredShipments(filtered)
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

  const handleTrackExternal = (trackingNumber, carrier) => {
    // TODO: Implement external tracking links
    console.log('Track externally:', trackingNumber, carrier)
    alert('External tracking functionality needs to be implemented')
  }

  const carriers = [...new Set(shipments.map(s => s.carrier).filter(Boolean))]

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
          <p className="text-gray-600 mt-2">Track your shipments and delivery status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={carrierFilter} onValueChange={setCarrierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Carriers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Carriers</SelectItem>
              {carriers.map(carrier => (
                <SelectItem key={carrier} value={carrier}>
                  {carrier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No shipments found</h3>
                <p>
                  {shipments.length === 0 
                    ? "You don't have any shipments yet." 
                    : "No shipments match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {shipment.tracking_number ? (
                        `Tracking: ${shipment.tracking_number}`
                      ) : (
                        `Shipment for Order #${shipment.orders?.order_number || 'Unknown'}`
                      )}
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

                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Shipping Address:</strong> {shipment.shipping_address}</p>
                  {shipment.actual_delivery && (
                    <p><strong>Delivered:</strong> {formatDate(shipment.actual_delivery)}</p>
                  )}
                </div>

                {/* Shipment Items */}
                {shipment.shipment_items && shipment.shipment_items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {shipment.shipment_items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.products?.name || 'Unknown Product'}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Shipment ID: {shipment.id.slice(0, 8)}
                    {shipment.orders && (
                      <span className="ml-4">Order: {shipment.orders.order_number}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {shipment.tracking_number && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTrackExternal(shipment.tracking_number, shipment.carrier)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Track External
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}