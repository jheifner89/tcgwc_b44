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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { db } from '@/lib/supabase'

export default function ImportDialog({ open, onOpenChange, onImportComplete }) {
  const [csvData, setCsvData] = useState('')
  const [loading, setLoading] = useState(false)

  const parseCsvData = (csvText) => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    
    return lines.slice(1).map(line => {
      const values = []
      let current = ''
      let inQuotes = false
      
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
      
      const product = {}
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, '') || ''
        
        switch (header) {
          case 'sku':
            product.sku = value
            break
          case 'name':
            product.name = value
            break
          case 'distributor':
            product.distributor = value
            break
          case 'product_line':
            product.product_line = value
            break
          case 'wholesale_price':
            product.wholesale_price = value ? parseFloat(value) : 0
            product.price = value ? parseFloat(value) : 0
            break
          case 'override_price':
            product.override_price = value ? parseFloat(value) : null
            break
          case 'override_end_date':
            product.override_end_date = value || null
            break
          case 'orders_due_date':
            product.orders_due_date = value || null
            break
          case 'release_date':
            product.release_date = value || null
            break
          case 'availability':
            product.availability = value || 'open'
            break
          case 'in_stock':
            product.in_stock = value === 'true' || value === '1'
            break
          case 'image_url':
            product.image_url = value
            break
          case 'product_url':
            product.product_url = value
            break
          case 'approved':
            product.approved = value === 'true' || value === '1'
            break
          case 'is_sample':
            product.is_sample = value === 'true' || value === '1'
            break
        }
      })
      
      // Set defaults
      product.category = product.product_line || ''
      product.stock_quantity = product.in_stock ? 1 : 0
      product.is_active = true
      
      return product
    })
  }

  const handleImport = async () => {
    if (!csvData.trim()) return
    
    setLoading(true)
    try {
      const products = parseCsvData(csvData)
      
      // Import products in batches
      const batchSize = 50
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)
        const { error } = await db.createProduct(batch)
        if (error) throw error
      }
      
      setCsvData('')
      onOpenChange(false)
      onImportComplete()
      alert(`Successfully imported ${products.length} products!`)
    } catch (error) {
      console.error('Error importing products:', error)
      alert('Error importing products. Please check your CSV format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
          <DialogDescription>
            Paste your CSV data below. Expected columns: sku, name, distributor, product_line, wholesale_price, availability, in_stock, image_url, etc.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-data">CSV Data</Label>
            <Textarea
              id="csv-data"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste your CSV data here..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading || !csvData.trim()}>
            {loading ? 'Importing...' : 'Import Products'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}