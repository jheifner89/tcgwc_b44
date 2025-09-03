import React, { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import ProductFilters from '@/components/ProductFilters'
import ProductList from '@/components/ProductList'
import RequestDialog from '@/components/RequestDialog'

export default function Products({ user }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDistributor, setSelectedDistributor] = useState('all')
  const [selectedAvailability, setSelectedAvailability] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // Get unique values for filters
  const categories = [...new Set(products.map(p => p.product_line).filter(Boolean))]
  const distributors = [...new Set(products.map(p => p.distributor).filter(Boolean))]
  const availabilities = [...new Set(products.map(p => p.availability).filter(Boolean))]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory, selectedDistributor, selectedAvailability, inStockOnly])

  const loadProducts = async () => {
    try {
      const { data, error } = await db.getProducts()
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.product_line === selectedCategory)
    }

    // Distributor filter
    if (selectedDistributor !== 'all') {
      filtered = filtered.filter(product => product.distributor === selectedDistributor)
    }

    // Availability filter
    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(product => product.availability === selectedAvailability)
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.in_stock)
    }

    setFilteredProducts(filtered)
  }

  const handleRequest = (product) => {
    setSelectedProduct(product)
    setShowRequestDialog(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-2">Browse and request products from our trusted distributors.</p>
          </div>
        </div>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600 mt-2">Browse and request products from our trusted distributors.</p>
        </div>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistributor={selectedDistributor}
        setSelectedDistributor={setSelectedDistributor}
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        categories={categories}
        distributors={distributors}
        availabilities={availabilities}
      />

      <ProductList products={filteredProducts} onRequest={handleRequest} />

      {/* Request Dialog */}
      <RequestDialog
        product={selectedProduct}
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        user={user}
      />
    </div>
  )
}