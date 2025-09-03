import React, { useState, useEffect } from 'react'
import { db } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import ProductFilters from '@/components/ProductFilters'
import ProductList from '@/components/ProductList'
import RequestDialog from '@/components/RequestDialog'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

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
  const [quantities, setQuantities] = useState({})
  const { toast } = useToast()

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

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }))
  }

  const handleRequest = async (product, quantity) => {
    try {
      // Check if there's an existing request for this product
      const { data: existingRequests, error: fetchError } = await db.getRequests()
      if (fetchError) throw fetchError

      const existingRequest = existingRequests?.find(request => 
        request.subject?.includes(product.name) && 
        request.status !== 'completed' && 
        request.status !== 'cancelled'
      )

      if (existingRequest) {
        // Extract current quantity from existing message
        const currentQtyMatch = existingRequest.message.match(/Quantity Requested: (\d+)/)
        const currentQty = currentQtyMatch ? parseInt(currentQtyMatch[1]) : 1
        const newQty = currentQty + quantity

        // Update existing request with new quantity
        const updatedMessage = existingRequest.message.replace(
          /Quantity Requested: \d+/,
          `Quantity Requested: ${newQty}`
        )

        const { error: updateError } = await db.updateRequest(existingRequest.id, {
          message: updatedMessage,
          updated_at: new Date().toISOString()
        })

        if (updateError) throw updateError

        toast({
          title: "Request Updated",
          description: `Added ${quantity} more to your existing request. Total quantity: ${newQty}`,
          variant: "success"
        })
      } else {
        // Create new request
        const displayPrice = product.override_price && 
          (!product.override_end_date || new Date(product.override_end_date) > new Date()) 
          ? product.override_price 
          : (product.wholesale_price || product.price || 0)

        const requestData = {
          customer_name: user?.email?.split('@')[0] || 'User',
          customer_email: user?.email || '',
          subject: `Product Request: ${product.name}`,
          message: `Product: ${product.name}
SKU: ${product.sku || 'N/A'}
Distributor: ${product.distributor || 'N/A'}
Product Line: ${product.product_line || 'N/A'}
Price: ${formatCurrency(displayPrice)}
Quantity Requested: ${quantity}
Availability: ${product.availability || 'open'}`,
          priority: 'medium',
          assigned_to: user?.id
        }

        const { error: createError } = await db.createRequest(requestData)
        if (createError) throw createError

        toast({
          title: "Request Submitted",
          description: `Your request for ${quantity} ${product.name} has been submitted!`,
          variant: "success"
        })
      }

      // Reset quantity for this product
      setQuantities(prev => ({ ...prev, [product.id]: 1 }))
    } catch (error) {
      console.error('Error creating/updating request:', error)
      toast({
        title: "Request Failed",
        description: "Error submitting request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRequestOld = (product) => {
    setSelectedProduct(product)
    setShowRequestDialog(true)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
    <div className="max-w-6xl mx-auto space-y-6">
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

      <ProductList 
        products={filteredProducts} 
        onRequest={handleRequest}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
      />

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