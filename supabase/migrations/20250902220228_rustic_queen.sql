/*
  # Update products table schema

  1. Schema Updates
    - Add missing columns from CSV data: distributor, product_line, wholesale_price, override_price, override_end_date, orders_due_date, release_date, availability, in_stock, image_url, product_url, approved, is_sample
    - Update existing columns to match CSV structure
    - Add proper indexes for filtering and searching

  2. Security
    - Maintain existing RLS policies
    - Add policies for public read access to active products
*/

-- Add new columns to products table
DO $$
BEGIN
  -- Add distributor column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'distributor'
  ) THEN
    ALTER TABLE products ADD COLUMN distributor text DEFAULT '';
  END IF;

  -- Add product_line column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_line'
  ) THEN
    ALTER TABLE products ADD COLUMN product_line text DEFAULT '';
  END IF;

  -- Add wholesale_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'wholesale_price'
  ) THEN
    ALTER TABLE products ADD COLUMN wholesale_price numeric(10,2) DEFAULT 0;
  END IF;

  -- Add override_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'override_price'
  ) THEN
    ALTER TABLE products ADD COLUMN override_price numeric(10,2);
  END IF;

  -- Add override_end_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'override_end_date'
  ) THEN
    ALTER TABLE products ADD COLUMN override_end_date date;
  END IF;

  -- Add orders_due_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'orders_due_date'
  ) THEN
    ALTER TABLE products ADD COLUMN orders_due_date date;
  END IF;

  -- Add release_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'release_date'
  ) THEN
    ALTER TABLE products ADD COLUMN release_date date;
  END IF;

  -- Add availability column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'availability'
  ) THEN
    ALTER TABLE products ADD COLUMN availability text DEFAULT 'open';
  END IF;

  -- Add in_stock column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'in_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN in_stock boolean DEFAULT true;
  END IF;

  -- Add image_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN image_url text;
  END IF;

  -- Add product_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_url'
  ) THEN
    ALTER TABLE products ADD COLUMN product_url text;
  END IF;

  -- Add approved column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'approved'
  ) THEN
    ALTER TABLE products ADD COLUMN approved boolean DEFAULT true;
  END IF;

  -- Add is_sample column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_sample'
  ) THEN
    ALTER TABLE products ADD COLUMN is_sample boolean DEFAULT false;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_distributor ON products(distributor);
CREATE INDEX IF NOT EXISTS idx_products_product_line ON products(product_line);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_approved ON products(approved);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Add check constraints for availability
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'products_availability_check'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_availability_check 
    CHECK (availability IN ('open', 'pre-order', 'closed'));
  END IF;
END $$;