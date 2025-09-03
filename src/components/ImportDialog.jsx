import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/lib/supabase'

export default function ImportDialog({ open, onOpenChange, onImportComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
      
      // Parse and preview first 5 rows
      try {
        const csvText = await file.text()
        const parsed = parseCsvData(csvText)
        setPreviewData(parsed.slice(0, 5))
        setShowPreview(true)
      } catch (error) {
        console.error('Error parsing CSV preview:', error)
        alert('Error parsing CSV file. Please check the format.')
      }
    } else {
      alert('Please select a valid CSV file')
      e.target.value = ''
      setShowPreview(false)
    }
  }

  const parseCsvData = (csvText) => {
    const lines = csvText.trim().split('\n')
    
    // Skip header row and process data rows
    return lines.slice(1).map(line => {
      const values = []
      let current = ''
      let inQuotes = false
      
      // Parse CSV with proper quote handling
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      // Map CSV columns to product object
      // Expected format: product_line,sku,name,wholesale_price,release_date,orders_due_date,availability,in_stock,image_url,product_url,distributor
      const product = {
        product_line: values[0]?.replace(/"/g, '') || '',
        sku: values[1]?.replace(/"/g, '') || '',
        name: values[2]?.replace(/"/g, '') || '',
        wholesale_price: values[3] ? parseFloat(values[3]) : 0,
        price: values[3] ? parseFloat(values[3]) : 0, // Set price same as wholesale_price
        release_date: values[4]?.replace(/"/g, '') || null,
        orders_due_date: values[5]?.replace(/"/g, '') || null,
        availability: values[6]?.replace(/"/g, '') || 'open',
        in_stock: values[7]?.replace(/"/g, '').toLowerCase() === 'true',
        image_url: values[8]?.replace(/"/g, '') || null,
        product_url: values[9]?.replace(/"/g, '') || null,
        distributor: values[10]?.replace(/"/g, '') || '',
        
        // Set additional required fields with defaults
        category: values[0]?.replace(/"/g, '') || '', // Use product_line as category
        description: '',
        cost: 0,
        stock_quantity: values[7]?.replace(/"/g, '').toLowerCase() === 'true' ? 1 : 0,
        is_active: true,
        override_price: null,
        override_end_date: null,
        approved: true,
        is_sample: false
      }
      
      // Convert date formats from MM/DD/YYYY to YYYY-MM-DD
      if (product.release_date && product.release_date !== '---') {
        try {
          const [month, day, year] = product.release_date.split('/')
          if (month && day && year) {
            product.release_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          } else {
            product.release_date = null
          }
        } catch {
          product.release_date = null
        }
      } else {
        product.release_date = null
      }
      
      if (product.orders_due_date && product.orders_due_date !== '---') {
        try {
          const [month, day, year] = product.orders_due_date.split('/')
          if (month && day && year) {
            product.orders_due_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          } else {
            product.orders_due_date = null
          }
        } catch {
          product.orders_due_date = null
        }
      } else {
        product.orders_due_date = null
      }
      
      return product
    }).filter(product => product.sku && product.name) // Only include products with SKU and name
  }

  const handleImport = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    try {
      const csvText = await selectedFile.text()
      const products = parseCsvData(csvText)
      
      if (products.length === 0) {
        throw new Error('No valid products found in CSV file')
      }
      
      // Import products in batches to avoid timeout
      const batchSize = 50
      let totalImported = 0
      let totalErrors = 0
      
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)
        
        try {
          const { data, error } = await db.bulkUpsertProducts(batch)
          if (error) {
            console.error('Batch error:', error)
            totalErrors += batch.length
          } else {
            totalImported += batch.length
          }
        } catch (batchError) {
          console.error('Batch processing error:', batchError)
          totalErrors += batch.length
        }
      }
      
      // Reset form state
      setSelectedFile(null)
      setPreviewData([])
      setShowPreview(false)
      
      // Reset file input
      const fileInput = document.getElementById('csv-file')
      if (fileInput) fileInput.value = ''
      
      onOpenChange(false)
      onImportComplete()
      
      if (totalErrors > 0) {
        alert(`Import completed with some issues:\n- Successfully imported: ${totalImported} products\n- Failed to import: ${totalErrors} products\n\nPlease check the console for detailed error information.`)
      } else {
        alert(`Successfully imported ${totalImported} products!`)
      }
    } catch (error) {
      console.error('Error importing products:', error)
      alert(`Error importing products: ${error.message}\n\nPlease check your CSV format matches the expected structure:\nproduct_line,sku,name,wholesale_price,release_date,orders_due_date,availability,in_stock,image_url,product_url,distributor`)
    } finally {
      setLoading(false)
    }
  }

  const resetImport = () => {
    setSelectedFile(null)
    setPreviewData([])
    setShowPreview(false)
    const fileInput = document.getElementById('csv-file')
    if (fileInput) fileInput.value = ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your product data. Expected format: product_line,sku,name,wholesale_price,release_date,orders_due_date,availability,in_stock,image_url,product_url,distributor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* CSV Format Example */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Expected CSV Format:</h4>
            <code className="text-xs text-gray-600 block break-all">
              product_line,sku,name,wholesale_price,release_date,orders_due_date,availability,in_stock,image_url,product_url,distributor
            </code>
            <div className="mt-2 text-xs text-gray-500">
              <p>• Dates should be in MM/DD/YYYY format or "---" for empty</p>
              <p>• in_stock should be "True" or "False"</p>
              <p>• availability should be "open", "pre-order", or "closed"</p>
            </div>
          </div>

          {/* Preview Data */}
          {showPreview && previewData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Preview (first 5 rows):</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <div className="max-h-60 overflow-y-auto">
                  <div className="space-y-2 p-3">
                    {previewData.map((product, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-600">Product Line:</span>
                            <div className="text-gray-900">{product.product_line}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">SKU:</span>
                            <div className="text-gray-900">{product.sku}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Name:</span>
                            <div className="text-gray-900 truncate" title={product.name}>{product.name}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Price:</span>
                            <div className="text-gray-900">${product.wholesale_price}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Availability:</span>
                            <div className="text-gray-900">{product.availability}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Stock:</span>
                            <div className="text-gray-900">{product.in_stock ? 'Yes' : 'No'}</div>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-3">
                            <span className="font-medium text-gray-600">Distributor:</span>
                            <div className="text-gray-900">{product.distributor}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Found {previewData.length > 0 ? `${previewData.length}+ products` : 'no valid products'} in the CSV file.
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {showPreview && (
            <Button type="button" variant="outline" onClick={resetImport}>
              Choose Different File
            </Button>
          )}
          <Button onClick={handleImport} disabled={loading || !selectedFile}>
            {loading ? 'Importing...' : 'Import Products'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}