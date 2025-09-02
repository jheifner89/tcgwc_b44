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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export default function RequestDialog({ product, open, onOpenChange, user }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    subject: '',
    message: '',
    priority: 'medium',
    quantity: 1
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const displayPrice = product.override_price && 
        (!product.override_end_date || new Date(product.override_end_date) > new Date()) 
        ? product.override_price 
        : (product.wholesale_price || product.price || 0)

      const requestData = {
        ...formData,
        subject: `Product Request: ${product?.name}`,
        message: `Product: ${product?.name}
SKU: ${product?.sku || 'N/A'}
Distributor: ${product?.distributor || 'N/A'}
Product Line: ${product?.product_line || 'N/A'}
Price: ${formatCurrency(displayPrice)}
Quantity Requested: ${formData.quantity}
Availability: ${product?.availability || 'open'}

Additional Message: ${formData.message}`,
        assigned_to: user?.id
      }

      const { error } = await db.createRequest(requestData)
      if (error) throw error

      // Reset form and close dialog
      setFormData({
        customer_name: '',
        customer_email: user?.email || '',
        subject: '',
        message: '',
        priority: 'medium',
        quantity: 1
      })
      onOpenChange(false)
      
      // Show success message
      alert('Request submitted successfully!')
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Error submitting request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayPrice = product?.override_price && 
    (!product?.override_end_date || new Date(product.override_end_date) > new Date()) 
    ? product.override_price 
    : (product?.wholesale_price || product?.price || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Product</DialogTitle>
          <DialogDescription>
            Submit a request for: {product?.name}
          </DialogDescription>
        </DialogHeader>
        
        {/* Product Summary */}
        {product && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex gap-3">
              <img
                src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
                alt={product.name}
                className="w-15 h-15 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                <p className="text-sm text-gray-600">Distributor: {product.distributor || 'N/A'}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatCurrency(displayPrice)}
                  {product.override_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(product.wholesale_price || product.price || 0)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">Email</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any additional details about your request..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}