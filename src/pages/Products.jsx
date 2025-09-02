import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, Upload, Plus } from 'lucide-react'
import { db } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import RequestDialog from '@/components/RequestDialog'
import ImportDialog from '@/components/ImportDialog'

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
  const [showImportDialog, setShowImportDialog] = useState(false)

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

  const handleImportComplete = () => {
    loadProducts()
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Distributor Filter */}
            <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
              <SelectTrigger>
                <SelectValue placeholder="All Distributors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distributors</SelectItem>
                {distributors.map(distributor => (
                  <SelectItem key={distributor} value={distributor}>
                    {distributor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                {availabilities.map(availability => (
                  <SelectItem key={availability} value={availability}>
                    {availability}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* In Stock Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
              <Label htmlFor="in-stock" className="text-sm font-medium">
                In Stock Only
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {searchTerm && `Search: "${searchTerm}"`}
            {selectedCategory !== 'all' && ` • Category: ${selectedCategory}`}
            {selectedDistributor !== 'all' && ` • Distributor: ${selectedDistributor}`}
            {selectedAvailability !== 'all' && ` • Availability: ${selectedAvailability}`}
            {inStockOnly && ` • In Stock Only`}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                {products.length === 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="mb-4">Get started by importing your product catalog.</p>
                    <Button onClick={() => setShowImportDialog(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Products
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-2">No products match your filters</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequest={handleRequest}
            />
          ))
        )}
      </div>

      {/* Request Dialog */}
      <RequestDialog
        product={selectedProduct}
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        user={user}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}