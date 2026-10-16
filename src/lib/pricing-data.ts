export const pricingFeatures = [
    {
        category: "Intelligence (AI Agents)",
        features: [
            {
                name: "Agent Debate Access",
                starter: "Text Only (Logs)",
                pro: "Visual Simulation",
                agency: "Visual + Custom Personas"
            },
            {
                name: "Competitor Spy Depth",
                starter: "Top 3 Stores",
                pro: "Top 10 + Ad Spy",
                agency: "Unlimited Deep Dive"
            },
            {
                name: "Market Analyst Model",
                starter: "GPT-3.5 Turbo",
                pro: "GPT-4o (Reasoning)",
                agency: "Claude 3.5 Sonnet (Creative)"
            }
        ]
    },
    {
        category: "Commerce Engine",
        features: [
            {
                name: "Store Generations",
                starter: "1 Store / mo",
                pro: "5 Stores / mo",
                agency: "Unlimited"
            },
            {
                name: "Shopify Push Strategy",
                starter: "Manual Review",
                pro: "1-Click Auto Push",
                agency: "Bulk Push (Empire Mode)"
            },
            {
                name: "Zendrop Sourcing",
                starter: "Public Catalog",
                pro: "Winning Products Only",
                agency: "Private Supplier Access"
            }
        ]
    },
    {
        category: "Affiliate Protocol",
        features: [
            {
                name: "Commission Rate",
                starter: "20% (Standard)",
                pro: "40% (Locked Power)",
                agency: "40% + VIP Payouts"
            },
            {
                name: "Cookie Duration",
                starter: "30 Days",
                pro: "90 Days (Sticky)",
                agency: "Lifetime Attribution"
            },
            {
                name: "Asset Kit Access",
                starter: "Basic Copy",
                pro: "4K Renders + Hooks",
                agency: "Custom Creatives"
            }
        ]
    },
    {
        category: "Support & Security",
        features: [
            {
                name: "Support Level",
                starter: "Community Discord",
                pro: "Priority Email",
                agency: "Dedicated Slack Channel"
            },
            {
                name: "Onboarding",
                starter: "Docs",
                pro: "Video Course",
                agency: "1:1 Strategy Call"
            }
        ]
    }
]

export const plans = [
    {
        name: "Starter",
        id: "starter",
        price: "$49",
        period: "/mo",
        description: "For aspiring entrepreneurs testing the waters.",
        cta: "Start Building",
        popular: false
    },
    {
        name: "Professional",
        id: "professional",
        price: "$99",
        period: "/mo",
        description: "The 'Sweet Spot'. Unlock visual agents & 40% commissions.",
        cta: "Go Pro",
        popular: true
    },
    {
        name: "Agency",
        id: "agency",
        price: "$299",
        period: "/mo",
        description: "Dominate the market with unlimited power.",
        cta: "Scale Empire",
        popular: false
    }
]
