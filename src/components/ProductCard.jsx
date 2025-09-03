import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default function ProductCard({ product, onRequest, quantity, onQuantityChange }) {
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'pre-order':
        return 'bg-blue-100 text-blue-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const displayPrice = product.override_price && 
    (!product.override_end_date || new Date(product.override_end_date) > new Date()) 
    ? product.override_price 
    : (product.wholesale_price || product.price || 0)

  // Check if requesting is available
  const isRequestingAvailable = () => {
    if (!product.approved) return false
    if (product.availability === 'closed') return false
    if (product.availability === 'open') return true
    if (product.availability === 'pre-order') {
      // For pre-orders, check if orders_due_date is in the future
      if (product.orders_due_date) {
        return new Date(product.orders_due_date) > new Date()
      }
      return true
    }
    return false
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
             src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=70&h=70&fit=crop'}
              alt={product.name}
             className="w-21 h-full object-cover rounded-md border border-gray-300 p-2.5"
              onError={(e) => {
               e.target.src = 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=70&h=70&fit=crop'
              }}
            />
          </div>

          {/* Product Details - Left Side */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-1">
              {product.name}
            </h3>
            
            {/* Product Line and Distributor */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.distributor || 'Unknown'}
              </Badge>
              <Badge 
                className={`text-xs ${getAvailabilityColor(product.availability)}`}
              >
                {product.availability || 'open'}
              </Badge>
              {product.availability !== 'open' && product.orders_due_date && (
                <Badge variant="outline" className="text-xs">
                  Due: {new Date(product.orders_due_date).toLocaleDateString()}
                </Badge>
              )}
              {product.is_sample && (
                <Badge variant="secondary" className="text-xs">
                  Sample
                </Badge>
              )}
            </div>

            {/* Price and SKU */}
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(displayPrice)}
              {product.override_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatCurrency(product.wholesale_price || product.price || 0)}
                </span>
              )}
            </div>
            {product.sku && (
              <div className="text-xs text-gray-500 mt-1">SKU: {product.sku}</div>
            )}
          </div>

          {/* Right Side - Quantity and Request */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-center text-sm"
                disabled={!isRequestingAvailable()}
              />
              <Button 
                size="sm"
                onClick={() => onRequest(product, quantity)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
                disabled={!isRequestingAvailable()}
              >
                Request
              </Button>
            </div>
            
            {/* Stock Status - Directly under the inputs */}
            <div className="text-left">
              <span className={`text-xs font-medium`}>
                <span className="text-gray-600">Stock: </span>
                <span className={`${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}