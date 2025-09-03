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
import { useToast } from '@/hooks/use-toast'

export default function ImportDialog({ open, onOpenChange, onImportComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file",
        variant: "destructive"
      })
      e.target.value = ''
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
        release_date: values[4]?.replace(/"/g, '') || '',
        orders_due_date: values[5]?.replace(/"/g, '') || '',
        availability: values[6]?.replace(/"/g, '') || 'open',
        in_stock: values[7]?.replace(/"/g, '').toLowerCase() === 'true',
        image_url: values[8]?.replace(/"/g, '') || null,
        product_url: values[9]?.replace(/"/g, '') || null,
        distributor: values[10]?.replace(/"/g, '') || '',
        
        // Set additional required fields with defaults
        is_active: true,
        override_price: null,
        override_end_date: null,
        approved: true,
      }
      
      // Convert date formats from MM/DD/YYYY to YYYY-MM-DD
      if (product.release_date && product.release_date !== '---' && product.release_date.trim() !== '') {
        try {
          // Check if date is already in YYYY-MM-DD format
          if (product.release_date.includes('-') && product.release_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Already in correct format, keep as is
            product.release_date = product.release_date
          } else if (product.release_date.includes('/')) {
            // Convert from MM/DD/YYYY to YYYY-MM-DD
            const [month, day, year] = product.release_date.split('/')
            if (month && day && year) {
              product.release_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            } else {
              product.release_date = null
            }
          } else {
            product.release_date = null
          }
        } catch {
          product.release_date = null
        }
      } else {
        product.release_date = null
      }
      
      if (product.orders_due_date && product.orders_due_date !== '---' && product.orders_due_date.trim() !== '') {
        try {
          // Check if date is already in YYYY-MM-DD format
          if (product.orders_due_date.includes('-') && product.orders_due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Already in correct format, keep as is
            product.orders_due_date = product.orders_due_date
          } else if (product.orders_due_date.includes('/')) {
            // Convert from MM/DD/YYYY to YYYY-MM-DD
            const [month, day, year] = product.orders_due_date.split('/')
            if (month && day && year) {
              product.orders_due_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            } else {
              product.orders_due_date = null
            }
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
      
      // Reset file input
      const fileInput = document.getElementById('csv-file')
      if (fileInput) fileInput.value = ''
      
      onOpenChange(false)
      onImportComplete()
      
      if (totalErrors > 0) {
        toast({
          title: "Import Completed with Issues",
          description: `Successfully imported: ${totalImported} products. Failed to import: ${totalErrors} products. Check console for details.`,
          variant: "warning"
        })
      } else {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${totalImported} products!`,
          variant: "success"
        })
      }
    } catch (error) {
      console.error('Error importing products:', error)
      toast({
        title: "Import Failed",
        description: `Error importing products: ${error.message}. Please check your CSV format.`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetImport = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById('csv-file')
    if (fileInput) fileInput.value = ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your product data.
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
            <div className="bg-white p-3 rounded border">
              <code className="text-xs text-gray-600 block break-all">
                product_line,sku,name,wholesale_price,release_date,orders_due_date,availability,in_stock,image_url,product_url,distributor
              </code>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>• Dates should be in YYYY-MM-DD or MM/DD/YYYY format, or "---" for empty</p>
              <p>• in_stock should be "True" or "False"</p>
              <p>• availability should be "open", "pre-order", or "closed"</p>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading || !selectedFile}>
            {loading ? 'Importing...' : 'Import Products'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}