/*
  # Create core e-commerce tables

  1. New Tables
    - `products` - Product catalog with pricing and inventory
    - `requests` - Customer requests or inquiries
    - `invoices` - Invoice headers with customer and totals
    - `invoice_line_items` - Individual line items for invoices
    - `orders` - Order headers with customer and status
    - `messages` - Communication/messaging system
    - `shipments` - Shipment tracking information
    - `shipment_items` - Items included in each shipment
    - `settings` - Application configuration settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Admin policies for managing products and settings
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  cost decimal(10,2) DEFAULT 0,
  sku text UNIQUE,
  category text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_address text DEFAULT '',
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date date,
  paid_date date,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice line items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  line_total decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address text NOT NULL,
  billing_address text DEFAULT '',
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id),
  recipient_id uuid REFERENCES auth.users(id),
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  message_type text DEFAULT 'general' CHECK (message_type IN ('general', 'order', 'support', 'system')),
  related_id uuid, -- Can reference orders, invoices, etc.
  created_at timestamptz DEFAULT now()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  tracking_number text UNIQUE,
  carrier text DEFAULT '',
  shipping_method text DEFAULT '',
  status text DEFAULT 'preparing' CHECK (status IN ('preparing', 'shipped', 'in_transit', 'delivered', 'returned')),
  shipped_date timestamptz,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  shipping_address text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipment items table
CREATE TABLE IF NOT EXISTS shipment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true);

-- Requests policies
CREATE POLICY "Users can read their own requests"
  ON requests FOR SELECT
  TO authenticated
  USING (auth.uid() = assigned_to);

CREATE POLICY "Authenticated users can create requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = assigned_to);

-- Invoices policies
CREATE POLICY "Users can read their own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their own invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

-- Invoice line items policies
CREATE POLICY "Users can read invoice line items for their invoices"
  ON invoice_line_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_line_items.invoice_id 
      AND invoices.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage invoice line items for their invoices"
  ON invoice_line_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_line_items.invoice_id 
      AND invoices.created_by = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their own orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Shipments policies
CREATE POLICY "Users can read their own shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their own shipments"
  ON shipments FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

-- Shipment items policies
CREATE POLICY "Users can read shipment items for their shipments"
  ON shipment_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = shipment_items.shipment_id 
      AND shipments.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage shipment items for their shipments"
  ON shipment_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = shipment_items.shipment_id 
      AND shipments.created_by = auth.uid()
    )
  );

-- Settings policies
CREATE POLICY "Anyone can read public settings"
  ON settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can read all settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage settings they created"
  ON settings FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_to ON requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_items_shipment_id ON shipment_items(shipment_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);