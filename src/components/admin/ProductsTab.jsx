import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ProductFilters from '@/components/ProductFilters'

export default function ProductsTab({
  products,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDistributor,
  setSelectedDistributor,
  selectedAvailability,
  setSelectedAvailability,
  inStockOnly,
  setInStockOnly,
  categories,
  distributors,
  availabilities,
  onImport,
  onExport,
  onSync,
  onAdd,
  onDelete
}) {
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'pre-order': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Products CSV
          </Button>
          <Button variant="outline" onClick={onSync}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Products
          </Button>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Product</th>
                  <th className="text-left p-4 font-medium text-gray-900">SKU</th>
                  <th className="text-left p-4 font-medium text-gray-900">Distributor</th>
                  <th className="text-left p-4 font-medium text-gray-900">Category</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="p-4 text-sm text-gray-600">{product.distributor}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {product.product_line || 'General'}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">
                      {formatCurrency(product.wholesale_price || product.price || 0)}
                    </td>
                    <td className="p-4">
                      <Badge className={`text-xs ${getAvailabilityColor(product.availability)}`}>
                        {product.availability || 'open'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}