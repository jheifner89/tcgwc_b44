import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import ProductCard from '@/components/ProductCard'

export default function ProductList({ products, onRequest, quantities, onQuantityChange }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRequest={onRequest}
          quantity={quantities[product.id] || 1}
          onQuantityChange={(qty) => onQuantityChange(product.id, qty)}
        />
      ))}
    </div>
  )
}