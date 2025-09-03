import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
}

// Database helpers
export const db = {
  // Products
  getProducts: () => supabase.from('products').select('*').eq('is_active', true),
  getProduct: (id) => supabase.from('products').select('*').eq('id', id).single(),
  createProduct: (product) => supabase.from('products').insert(product),
  updateProduct: (id, updates) => supabase.from('products').update(updates).eq('id', id),
  deleteProduct: (id) => supabase.from('products').update({ is_active: false }).eq('id', id),

  // Orders
  getOrders: () => supabase.from('orders').select('*').order('created_at', { ascending: false }),
  getOrder: (id) => supabase.from('orders').select('*').eq('id', id).single(),
  createOrder: (order) => supabase.from('orders').insert(order),
  updateOrder: (id, updates) => supabase.from('orders').update(updates).eq('id', id),

  // Invoices
  getInvoices: () => supabase.from('invoices').select(`
    *,
    invoice_line_items (
      id,
      description,
      quantity,
      unit_price,
      line_total,
      product_id,
      products (name)
    )
  `).order('created_at', { ascending: false }),
  getInvoice: (id) => supabase.from('invoices').select(`
    *,
    invoice_line_items (
      id,
      description,
      quantity,
      unit_price,
      line_total,
      product_id,
      products (name)
    )
  `).eq('id', id).single(),
  createInvoice: (invoice) => supabase.from('invoices').insert(invoice),
  updateInvoice: (id, updates) => supabase.from('invoices').update(updates).eq('id', id),

  // Invoice Line Items
  createInvoiceLineItem: (lineItem) => supabase.from('invoice_line_items').insert(lineItem),
  updateInvoiceLineItem: (id, updates) => supabase.from('invoice_line_items').update(updates).eq('id', id),
  deleteInvoiceLineItem: (id) => supabase.from('invoice_line_items').delete().eq('id', id),

  // Requests
  getRequests: () => supabase.from('requests').select('*').order('created_at', { ascending: false }),
  getRequest: (id) => supabase.from('requests').select('*').eq('id', id).single(),
  createRequest: (request) => supabase.from('requests').insert(request),
  updateRequest: (id, updates) => supabase.from('requests').update(updates).eq('id', id),

  // Messages
  getMessages: () => supabase.from('messages').select('*').order('created_at', { ascending: false }),
  getMessage: (id) => supabase.from('messages').select('*').eq('id', id).single(),
  createMessage: (message) => supabase.from('messages').insert(message),
  markMessageAsRead: (id) => supabase.from('messages').update({ is_read: true }).eq('id', id),

  // Shipments
  getShipments: () => supabase.from('shipments').select(`
    *,
    orders (order_number, customer_name),
    shipment_items (
      id,
      quantity,
      products (name, sku)
    )
  `).order('created_at', { ascending: false }),
  getShipment: (id) => supabase.from('shipments').select(`
    *,
    orders (order_number, customer_name),
    shipment_items (
      id,
      quantity,
      products (name, sku)
    )
  `).eq('id', id).single(),
  createShipment: (shipment) => supabase.from('shipments').insert(shipment),
  updateShipment: (id, updates) => supabase.from('shipments').update(updates).eq('id', id),

  // Settings
  getSettings: () => supabase.from('settings').select('*'),
  getSetting: (key) => supabase.from('settings').select('*').eq('key', key).single(),
  updateSetting: (key, value) => supabase.from('settings').upsert({ key, value }),

  // CSV Export
  exportProductsCSV: async () => {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('product_line', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) throw error
    
    // Convert to CSV format matching the provided structure
    const csvHeaders = [
      'product_line',
      'sku', 
      'name',
      'wholesale_price',
      'release_date',
      'orders_due_date',
      'availability',
      'in_stock',
      'image_url',
      'product_url',
      'distributor'
    ]
    
    const csvRows = products.map(product => [
      product.product_line || '',
      product.sku || '',
      product.name || '',
      product.wholesale_price || product.price || 0,
      product.release_date || '',
      product.orders_due_date || '',
      product.availability || 'open',
      product.in_stock ? 'True' : 'False',
      product.image_url || '',
      product.product_url || '',
      product.distributor || ''
    ])
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(field => {
          // Escape fields that contain commas or quotes
          const stringField = String(field)
          if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`
          }
          return stringField
        }).join(',')
      )
    ].join('\n')
    
    return csvContent
  }
}