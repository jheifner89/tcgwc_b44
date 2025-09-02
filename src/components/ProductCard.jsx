import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default function ProductCard({ product, onRequest }) {
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

  const getStockStatus = (inStock, availability) => {
    if (availability === 'pre-order') return 'Pre-Order'
    if (inStock) return 'In Stock'
    return 'Out of Stock'
  }

  const getStockColor = (inStock, availability) => {
    if (availability === 'pre-order') return 'text-blue-600'
    if (inStock) return 'text-green-600'
    return 'text-red-600'
  }

  const displayPrice = product.override_price && 
    (!product.override_end_date || new Date(product.override_end_date) > new Date()) 
    ? product.override_price 
    : (product.wholesale_price || product.price || 0)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              {product.is_sample && (
                <Badge variant="secondary" className="text-xs ml-2">
                  Sample
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {product.product_line || 'General'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {product.distributor || 'Unknown'}
              </Badge>
              <Badge 
                className={`text-xs ${getAvailabilityColor(product.availability)}`}
              >
                {product.availability || 'open'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(displayPrice)}
                  {product.override_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(product.wholesale_price || product.price || 0)}
                    </span>
                  )}
                </div>
                <div className={`text-sm font-medium ${getStockColor(product.in_stock, product.availability)}`}>
                  Stock: {getStockStatus(product.in_stock, product.availability)}
                </div>
                {product.sku && (
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Qty</div>
                  <div className="text-lg font-medium">1</div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onRequest(product)}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                  disabled={!product.approved || (!product.in_stock && product.availability !== 'pre-order')}
                >
                  Request
                </Button>
              </div>
            </div>

            {/* Additional product info */}
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              {product.release_date && (
                <div>Release Date: {new Date(product.release_date).toLocaleDateString()}</div>
              )}
              {product.orders_due_date && (
                <div>Orders Due: {new Date(product.orders_due_date).toLocaleDateString()}</div>
              )}
              {product.override_end_date && (
                <div>Special Price Until: {new Date(product.override_end_date).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}