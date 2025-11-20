#!/bin/bash

# setup.sh - Complete AURA setup script
# Run with: bash setup.sh or chmod +x setup.sh && ./setup.sh

set -e

echo "🚀 Setting up AURA..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

npm install

# Install additional required packages
echo -e "${BLUE}📦 Installing additional packages...${NC}"

npm install @supabase/supabase-js@^2.38.4
npm install @anthropic-ai/sdk@^0.9.1
npm install @google/generative-ai@^0.2.1
npm install @tanstack/react-query@^5.12.0
npm install framer-motion@^10.16.5
npm install gsap@^3.12.2
npm install recharts@^2.10.3
npm install lucide-react@^0.294.0
npm install zod@^3.22.4
npm install react-hook-form@^7.48.2
npm install @hookform/resolvers@^3.3.2
npm install zustand@^4.4.7
npm install date-fns@^2.30.0
npm install canvas-confetti@^1.9.3
npm install sonner@^1.2.0
npm install clsx@^2.0.0
npm install tailwind-merge@^2.1.0
npm install class-variance-authority@^0.7.0
npm install react-confetti@^6.1.0

# Dev dependencies
echo -e "${BLUE}📦 Installing dev dependencies...${NC}"

npm install -D @types/node@^20.10.0
npm install -D @types/react@^18.2.43
npm install -D @types/react-dom@^18.2.17
npm install -D typescript@^5.2.2
npm install -D eslint@^8.55.0
npm install -D @typescript-eslint/eslint-plugin@^6.14.0
npm install -D @typescript-eslint/parser@^6.14.0
npm install -D eslint-plugin-react-hooks@^4.6.0
npm install -D eslint-plugin-react-refresh@^0.4.5
npm install -D prettier@^3.1.1
npm install -D prettier-plugin-tailwindcss@^0.5.10
npm install -D autoprefixer@^10.4.16
npm install -D postcss@^8.4.32
npm install -D tailwindcss@^3.3.6
npm install -D tailwindcss-animate@^1.0.7

# 2. Create .env file if it doesn't exist
echo -e "${BLUE}🔐 Creating environment file...${NC}"

if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
VITE_ANTHROPIC_API_KEY=
VITE_GOOGLE_AI_API_KEY=

# LemonSqueezy
VITE_LEMONSQUEEZY_API_KEY=
VITE_LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_VARIANT_PRO=
LEMONSQUEEZY_VARIANT_ENTERPRISE=

# Resend
VITE_RESEND_API_KEY=

# App
VITE_APP_URL=http://localhost:5173
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

# 3. Verify TypeScript configuration
echo -e "${BLUE}🔍 Verifying TypeScript configuration...${NC}"

if [ ! -f tsconfig.json ]; then
    echo -e "${YELLOW}⚠️  tsconfig.json not found. Creating...${NC}"
    # tsconfig.json should already exist, but just in case
fi

# 4. Verify Tailwind configuration
echo -e "${BLUE}🎨 Verifying Tailwind configuration...${NC}"

if [ ! -f tailwind.config.js ]; then
    echo -e "${YELLOW}⚠️  tailwind.config.js not found. Creating...${NC}"
fi

# 5. Create database directory if it doesn't exist
echo -e "${BLUE}🗄️  Setting up database directory...${NC}"

mkdir -p database
if [ ! -f database/schema.sql ]; then
    echo -e "${YELLOW}⚠️  database/schema.sql not found. Please create it.${NC}"
fi

# 6. Summary
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Fill in .env with your API keys"
echo "2. Set up Supabase project and run database/schema.sql"
echo "3. Run 'npm run dev' to start development server"
echo "4. Visit http://localhost:5173"
echo ""
echo -e "${YELLOW}💡 Don't forget to:${NC}"
echo "- Set up Supabase project at https://supabase.com"
echo "- Get API keys from Anthropic, Google AI, Resend, and LemonSqueezy"
echo "- Run database/schema.sql in Supabase SQL Editor"
echo "- Configure authentication providers in Supabase"
echo ""

