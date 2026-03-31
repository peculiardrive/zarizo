-- Zarizo Seed Data

-- Assuming users table schema logic structure
-- Replace generic UUIDs with actual values when importing via Supabase UI or migrations

-- 1. Insert Admin
INSERT INTO public.users (id, full_name, email, phone, password_hash, role, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'System Admin', 'admin@zarizo.com', '+2348000000001', 'hashed_pw', 'admin', 'active');

-- 2. Insert Business Owner
INSERT INTO public.users (id, full_name, email, phone, password_hash, role, status)
VALUES ('00000000-0000-0000-0000-000000000002', 'Jane Business', 'jane@business.com', '+2348000000002', 'hashed_pw', 'business_owner', 'active');

-- 3. Insert Business Record
INSERT INTO public.businesses (id, owner_user_id, business_name, owner_name, email, phone, description, status)
VALUES ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Zarizo Verified Tech', 'Jane Business', 'contact@business.com', '+2348000000002', 'High quality electronics and digital goods.', 'approved');

-- 4. Insert Agent
INSERT INTO public.users (id, full_name, email, phone, password_hash, role, status)
VALUES ('00000000-0000-0000-0000-000000000003', 'Agent Alex', 'alex@agent.com', '+2348000000003', 'hashed_pw', 'agent', 'active');

INSERT INTO public.agents (id, user_id, referral_code, bank_name, account_name, account_number, status)
VALUES ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'ALEX2026', 'Bank Of Progress', 'Agent Alex', '0123456789', 'approved');

-- 5. Insert Products under Business
INSERT INTO public.products (id, business_id, title, type, description, price, commission_type, commission_value, status)
VALUES 
('p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Premium UX Toolkit', 'digital', 'A high quality toolkit for designers.', 50.00, 'percentage', 10.00, 'active'),
('p0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Sales Network Masterclass', 'physical', 'Grow your sales with this exclusive guide.', 99.00, 'fixed', 15.00, 'active'),
('p0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', '1-on-1 SEO Consulting', 'service', 'Professional website audit and scaling strategy session.', 250.00, 'percentage', 20.00, 'active');

-- 6. Insert Mock Order (Placed by Customer using Agent link)
INSERT INTO public.orders (id, product_id, business_id, agent_id, customer_name, customer_phone, customer_address, appointment_date, requirements_note, quantity, total_amount, order_status, payment_status)
VALUES 
('o0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Customer Chris', '+2348000000004', '123 Fake Street, Lagos', NULL, NULL, 1, 50.00, 'confirmed', 'pending'),
('o0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Client Sarah', '+2348000000005', NULL, '2026-04-10 10:00:00+00', 'Focus on e-commerce conversion rates.', 1, 250.00, 'scheduled', 'paid');

-- 7. Insert Commission generated from the order (10% of 50 = $5.00)
INSERT INTO public.commissions (id, order_id, agent_id, amount, payout_status)
VALUES ('c0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 5.00, 'pending');

-- 8. V2 Preview: Insert Mock Reseller Data
INSERT INTO public.resellers (id, user_id, business_id, reseller_code, bank_name, account_name, account_number, status)
VALUES ('r0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'ALEX_RESELL', 'Bank Of Progress', 'Agent Alex', '0123456789', 'approved');
