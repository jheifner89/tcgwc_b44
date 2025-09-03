import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/supabase'
import ImportDialog from '@/components/ImportDialog'
import ProductsTab from '@/components/admin/ProductsTab'
import UsersTab from '@/components/admin/UsersTab'
import RequestsTab from '@/components/admin/RequestsTab'
import InvoicesTab from '@/components/admin/InvoicesTab'
import OrdersTab from '@/components/admin/OrdersTab'

export default function AdminDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [invoices, setInvoices] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  
  // Product filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDistributor, setSelectedDistributor] = useState('all')
  const [selectedAvailability, setSelectedAvailability] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  
  // Dialogs
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Get unique values for filters
  const categories = [...new Set(products.map(p => p.product_line).filter(Boolean))]
  const distributors = [...new Set(products.map(p => p.distributor).filter(Boolean))]
  const availabilities = [...new Set(products.map(p => p.availability).filter(Boolean))]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, requestsRes, invoicesRes, ordersRes] = await Promise.all([
        db.getProducts(),
        db.getRequests(),
        db.getInvoices(),
        db.getOrders()
      ])
      
      setProducts(productsRes.data || [])
      setRequests(requestsRes.data || [])
      setInvoices(invoicesRes.data || [])
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportComplete = () => {
    loadData()
  }

  const handleExportCSV = async () => {
    try {
      const csvContent = await db.exportProductsCSV()
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Error exporting products to CSV')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await db.deleteProduct(productId)
        if (error) throw error
        loadData()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your system data and settings.</p>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your system data and settings.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <ProductsTab
            products={products}
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
            onImport={() => setShowImportDialog(true)}
            onExport={handleExportCSV}
            onSync={() => console.log('Sync products')}
            onAdd={() => setShowAddForm(true)}
            onDelete={handleDeleteProduct}
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <RequestsTab requests={requests} />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoicesTab invoices={invoices} />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <OrdersTab orders={orders} />
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}