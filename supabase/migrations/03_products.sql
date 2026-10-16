-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost DECIMAL(10,2),
  sku TEXT,
  inventory_quantity INT DEFAULT 0,
  
  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  
  -- Supplier (Dropshipping)
  supplier TEXT CHECK (supplier IN ('cj', 'printful', 'manual')),
  supplier_product_id TEXT,
  supplier_variant_id TEXT,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Stats
  total_sales INT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_business_id ON products(business_id);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage products of own businesses" ON products
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM businesses WHERE id = products.business_id
    )
  );
