-- ============================================================
-- ZARIZO RLS + SCHEMA PATCH
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add avatar_url column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- 2. ENABLE RLS ON ALL TABLES (if not already enabled)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS POLICIES: USERS TABLE
-- ============================================================
-- Users can read their own record
CREATE POLICY IF NOT EXISTS "Users can read own record"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Users can update their own record
CREATE POLICY IF NOT EXISTS "Users can update own record"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Admins can read ALL users
CREATE POLICY IF NOT EXISTS "Admins can read all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Allow insert during signup (service role handles this, but anon needs it too)
CREATE POLICY IF NOT EXISTS "Allow public insert on signup"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================================
-- 4. RLS POLICIES: AGENTS TABLE
-- ============================================================
-- Agents can read their own profile
CREATE POLICY IF NOT EXISTS "Agents can read own profile"
  ON public.agents FOR SELECT
  USING (user_id = auth.uid());

-- Agents can update their own profile
CREATE POLICY IF NOT EXISTS "Agents can update own profile"
  ON public.agents FOR UPDATE
  USING (user_id = auth.uid());

-- Allow insert during signup
CREATE POLICY IF NOT EXISTS "Allow agent insert on signup"
  ON public.agents FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can read ALL agents
CREATE POLICY IF NOT EXISTS "Admins can read all agents"
  ON public.agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admins can update ALL agents (for approval)
CREATE POLICY IF NOT EXISTS "Admins can update all agents"
  ON public.agents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================
-- 5. RLS POLICIES: BUSINESSES TABLE
-- ============================================================
-- Business owners can read their own business
CREATE POLICY IF NOT EXISTS "Business owners can read own business"
  ON public.businesses FOR SELECT
  USING (owner_user_id = auth.uid());

-- Business owners can update their own business
CREATE POLICY IF NOT EXISTS "Business owners can update own business"
  ON public.businesses FOR UPDATE
  USING (owner_user_id = auth.uid());

-- Allow insert during signup
CREATE POLICY IF NOT EXISTS "Allow business insert on signup"
  ON public.businesses FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

-- Admins can read ALL businesses
CREATE POLICY IF NOT EXISTS "Admins can read all businesses"
  ON public.businesses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admins can update ALL businesses
CREATE POLICY IF NOT EXISTS "Admins can update all businesses"
  ON public.businesses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================
-- 6. RLS POLICIES: PRODUCTS TABLE
-- ============================================================
-- Anyone (including anon) can read ACTIVE products (for public catalog)
CREATE POLICY IF NOT EXISTS "Anyone can view active products"
  ON public.products FOR SELECT
  USING (status = 'active');

-- Business owners can read ALL their own products (inc. inactive)
CREATE POLICY IF NOT EXISTS "Business owners can read own products"
  ON public.products FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Business owners can insert products
CREATE POLICY IF NOT EXISTS "Business owners can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Business owners can update their own products
CREATE POLICY IF NOT EXISTS "Business owners can update own products"
  ON public.products FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Admins can manage all products
CREATE POLICY IF NOT EXISTS "Admins can manage all products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================
-- 7. RLS POLICIES: ORDERS TABLE
-- ============================================================
-- Anyone can insert an order (customers checking out)
CREATE POLICY IF NOT EXISTS "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Business owners can read orders for their business
CREATE POLICY IF NOT EXISTS "Business owners can read own orders"
  ON public.orders FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Business owners can update order status
CREATE POLICY IF NOT EXISTS "Business owners can update own orders"
  ON public.orders FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Agents can read orders attributed to them
CREATE POLICY IF NOT EXISTS "Agents can read own attributed orders"
  ON public.orders FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.agents WHERE user_id = auth.uid()
    )
  );

-- Admins can read and update ALL orders
CREATE POLICY IF NOT EXISTS "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================
-- 8. RLS POLICIES: COMMISSIONS TABLE
-- ============================================================
-- Agents can read their own commissions
CREATE POLICY IF NOT EXISTS "Agents can read own commissions"
  ON public.commissions FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.agents WHERE user_id = auth.uid()
    )
  );

-- System/admins can insert commissions
CREATE POLICY IF NOT EXISTS "Allow commission insert"
  ON public.commissions FOR INSERT
  WITH CHECK (true);

-- Admins can read and update ALL commissions
CREATE POLICY IF NOT EXISTS "Admins can manage all commissions"
  ON public.commissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
