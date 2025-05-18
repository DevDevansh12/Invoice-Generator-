/*
  # Initial Schema Setup

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `gst_no` (text)
      - `pan_no` (text)
      - `city` (text)
      - `state` (text)
      - `phone_no` (text)
      - `email_id` (text)
      - `country` (text)
      - `pin_code` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text)
      - `bill_no` (text)
      - `date` (date)
      - `customer_id` (uuid, foreign key)
      - `booked_by` (text)
      - `vehicle_no` (text)
      - `address` (text)
      - `detail_address` (text)
      - `contact_no` (text)
      - `email_id` (text)
      - `gst_no` (text)
      - `pan_no` (text)
      - `duty_from` (date)
      - `duty_to` (date)
      - `kilometer` (text)
      - `vehicle_detail` (text)
      - `rate` (numeric)
      - `duty_description` (text)
      - `cgst` (numeric)
      - `sgst` (numeric)
      - `total` (numeric)
      - `signature` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `guest_names`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key)
      - `name` (text)

    - `invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key)
      - `description` (text)
      - `rate` (numeric)
      - `quantity` (numeric)
      - `amount` (numeric)

    - `settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `business_name` (text)
      - `business_address` (text)
      - `business_email` (text)
      - `business_phone` (text)
      - `business_logo` (text)
      - `signature` (text)
      - `cgst_rate` (numeric)
      - `sgst_rate` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  gst_no TEXT,
  pan_no TEXT,
  city TEXT,
  state TEXT,
  phone_no TEXT,
  email_id TEXT,
  country TEXT,
  pin_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL,
  bill_no TEXT,
  date DATE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  booked_by TEXT,
  vehicle_no TEXT,
  address TEXT,
  detail_address TEXT,
  contact_no TEXT,
  email_id TEXT,
  gst_no TEXT,
  pan_no TEXT,
  duty_from DATE,
  duty_to DATE,
  kilometer TEXT,
  vehicle_detail TEXT,
  rate NUMERIC,
  duty_description TEXT,
  cgst NUMERIC,
  sgst NUMERIC,
  total NUMERIC,
  signature TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create guest_names table
CREATE TABLE guest_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

-- Create invoice_items table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  amount NUMERIC NOT NULL
);

-- Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  business_name TEXT,
  business_address TEXT,
  business_email TEXT,
  business_phone TEXT,
  business_logo TEXT,
  signature TEXT,
  cgst_rate NUMERIC DEFAULT 9,
  sgst_rate NUMERIC DEFAULT 9,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own customers"
  ON customers
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own invoices"
  ON invoices
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage guest names for their invoices"
  ON guest_names
  USING (invoice_id IN (
    SELECT id FROM invoices WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage invoice items for their invoices"
  ON invoice_items
  USING (invoice_id IN (
    SELECT id FROM invoices WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own settings"
  ON settings
  USING (auth.uid() = user_id);