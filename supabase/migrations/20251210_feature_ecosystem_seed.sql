-- 1. Add the missing column safely (prevents "column does not exist" error)
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS duration_minutes integer default 0;

-- 2. Insert Data safely
-- We use a CTE (Common Table Expression) to hold the raw data, 
-- then we insert it while generating the required 'slug' automatically.

WITH new_courses (title, description, category, thumbnail_url, level, duration_minutes, published) AS (
  VALUES 
  -- FOUNDATION
  ('AURA 101: The Universal OS', 'Master the interface and set up your first agent.', 'Foundation', 'https://images.unsplash.com/photo-1614728853798-69883d21396b?w=800', 'Beginner', 45, true),
  ('Prompt Engineering Mastery', 'How to talk to the machine to get expert outputs.', 'Foundation', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', 'Intermediate', 60, true),
  ('The Autonomous Mindset', 'Rewiring your brain for delegation.', 'Foundation', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800', 'Beginner', 30, true),

  -- CONTENT STUDIO
  ('Viral Script Formulas', 'The 3-step structure for 1M+ views.', 'Content', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800', 'Intermediate', 90, true),
  ('AI Video Production', 'From text to cinema-quality video in minutes.', 'Content', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800', 'Advanced', 120, true),
  ('The Faceless Brand', 'Building an empire without showing your face.', 'Content', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', 'Beginner', 45, true),
  ('Instagram Growth Hacking', 'Using the Muse Engine for Reels domination.', 'Content', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800', 'Intermediate', 60, true),
  ('LinkedIn Thought Leadership', 'Automating your professional brand.', 'Content', 'https://images.unsplash.com/photo-1611944212129-29990bd0c6cf?w=800', 'Advanced', 90, true),
  ('YouTube Automation', 'Managing 5 channels with 1 person.', 'Content', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800', 'Advanced', 180, true),
  ('AI Art Direction', 'Midjourney & DALL-E mastery via AURA.', 'Content', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800', 'Intermediate', 60, true),

  -- SALES & OPS
  ('The Velociryaptor Protocol', 'Setting up your 24/7 sales agent.', 'Sales', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Advanced', 90, true),
  ('Cold Email That Converts', 'Psychology of the open rate.', 'Sales', 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800', 'Intermediate', 45, true),
  ('CRM Housekeeping', 'Automated data enrichment.', 'Sales', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Beginner', 30, true),
  ('Handling Objections with AI', 'Training the bot to close deals.', 'Sales', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', 'Advanced', 60, true),
  ('Inbound Lead Qualification', 'Filtering tyrekickers automatically.', 'Sales', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', 'Intermediate', 45, true),

  -- FINANCIAL HUB
  ('Profit First for AI Agencies', 'Managing cashflow with the Financial Hub.', 'Finance', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 'Intermediate', 60, true),
  ('Tax Optimization 101', 'What the AI can deduct for you.', 'Finance', 'https://images.unsplash.com/photo-1554224154-260327c00c19?w=800', 'Advanced', 90, true),
  ('Pricing Psychology', 'How to charge high-ticket.', 'Finance', 'https://images.unsplash.com/photo-1565514020176-6c2235c874b4?w=800', 'Beginner', 45, true),
  ('Automated Invoicing', 'Getting paid while you sleep.', 'Finance', 'https://images.unsplash.com/photo-1611944212129-29990bd0c6cf?w=800', 'Beginner', 30, true),
  ('Expense Leakage Detection', 'Finding hidden costs in your P&L.', 'Finance', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800', 'Intermediate', 45, true),

  -- GROWTH & ADS
  ('The Pixel Perfect Method', 'Structuring ad accounts for scale.', 'Growth', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Advanced', 120, true),
  ('Facebook Ads in 2025', 'Surviving the privacy era.', 'Growth', 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800', 'Intermediate', 60, true),
  ('TikTok Ads Strategy', 'UGC that prints money.', 'Growth', 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800', 'Intermediate', 60, true),
  ('SaaS Metrics Deep Dive', 'LTV, CAC, and Churn explained.', 'Growth', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'Advanced', 90, true),
  ('Viral Loop Engineering', 'Building referral programs that work.', 'Growth', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', 'Advanced', 60, true),

  -- BUSINESS WIZARD & LAUNCH
  ('Niche Selection Masterclass', 'Finding the blue ocean.', 'Launch', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Beginner', 60, true),
  ('Offer Creation', 'Packaging your value.', 'Launch', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', 'Intermediate', 60, true),
  ('Landing Page Psychology', 'High-converting copy principles.', 'Launch', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', 'Intermediate', 90, true),
  ('The 60-Second Launch', 'Live demo of the Empire Builder.', 'Launch', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'Beginner', 30, true),
  ('Legal Structures for Digital Biz', 'LLCs vs Sole Props.', 'Launch', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', 'Advanced', 45, true),

  -- AFFILIATE
  ('Recruiting Affiliates', 'Finding partners who sell for you.', 'Affiliate', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800', 'Intermediate', 60, true),
  ('Commission Structures', 'Math behind the payout.', 'Affiliate', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 'Advanced', 45, true),
  ('Affiliate Leaderboards', 'Gamifying your sales team.', 'Affiliate', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800', 'Intermediate', 30, true)
)
INSERT INTO public.courses (
  title, 
  description, 
  category, 
  thumbnail_url, 
  level, 
  duration_minutes, 
  published, 
  slug -- Required by your table
)
SELECT 
  title, 
  description, 
  category, 
  thumbnail_url, 
  level, 
  duration_minutes, 
  published,
  -- Auto-generate slug: "AURA 101: The Universal OS" -> "aura-101-the-universal-os"
  lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
FROM new_courses
ON CONFLICT (slug) DO NOTHING;