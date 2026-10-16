import { supabase } from "@/lib/supabase"

const PLAID_CLIENT_ID = import.meta.env.VITE_PLAID_CLIENT_ID
// COINGECKO_KEY removed


export interface FinancialSnapshot {
    netWorth: number
    currency: string
    assets: {
        cash: number
        crypto: number
        stocks: number
        business: number
    }
    history: { date: string, value: number, btc: number }[]
    allocation: { name: string, value: number, color: string }[]
}

export class FinancialAgent {

    /**
     * Connects to Plaid (Real) or simulates connection (Demo).
     */
    async connectBank(): Promise<boolean> {
        if (!PLAID_CLIENT_ID) {
            console.warn("FinancialAgent: No Plaid Key. Simulating connection...")
            await new Promise(r => setTimeout(r, 2000))
            return true
        }

        try {
            // Real Flow: Get Link Token from Backend
            const { data, error } = await supabase.functions.invoke('plaid-proxy', {
                body: { action: 'create_link_token' }
            })

            if (error) throw error

            // In a real app, this would trigger the Plaid Link React Hook
            // For now, we return success to indicate "Ready to Link"
            console.log("FinancialAgent: Plaid Link Token received", data.link_token)
            return true

        } catch (e) {
            console.error("Plaid Connection Failed:", e)
            throw new Error("Failed to connect to banking provider.")
        }
    }

    /**
     * Aggregates Wealth Data (Real or Simulated).
     */
    async getWealthOverview(): Promise<FinancialSnapshot> {
        // 1. Try to fetch real Crypto data via CoinGecko (Simple public API check)
        let btcPrice = 64000
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
            const data = await response.json()
            if (data.bitcoin?.usd) {
                btcPrice = data.bitcoin.usd
            }
        } catch (e) {
            console.warn("CoinGecko Fetch failed, using fallback")
        }

        // 2. Logic: If Plaid is not set up, return robust Simulation Data
        if (!PLAID_CLIENT_ID) {
            return this.getSimulationData(btcPrice)
        }

        // 3. Logic: Fetch Real Backend Data
        try {
            const { data, error } = await supabase.functions.invoke('financial-proxy', {
                body: { action: 'get_net_worth' }
            })

            if (error || !data) throw error
            return data

        } catch (e) {
            console.error("Financial Cloud Sync Failed. Reverting to Offline Mode.")
            return this.getSimulationData(btcPrice)
        }
    }

    /**
     * AI Analyst: analyzes spending habits.
     */
    async analyzeFinances(_snapshot: FinancialSnapshot) {
        // This would connect to Gemini to analyze the numbers
        // Placeholder for now
        return [
            { title: "Accumulate Bitcoin", confidence: "High", desc: "BTC is undervalued relative to recent hash rate highs." },
            { title: "Cut Subscription Costs", confidence: "Medium", desc: "You have 4 unused SaaS subscriptions totaling $120/mo." }
        ]
    }

    private getSimulationData(btcPrice: number): FinancialSnapshot {
        // Dynamic Simulation based on "today's" BTC price to make it feel alive
        const btcHoldings = 0.5 // 0.5 BTC
        const cryptoValue = btcHoldings * btcPrice

        return {
            netWorth: 124500 + (Math.random() * 1000), // Live-ish number
            currency: 'USD',
            assets: {
                cash: 12400,
                crypto: cryptoValue, // Real-time derived
                stocks: 65000,
                business: 15000
            },
            history: Array.from({ length: 30 }, (_, i) => ({
                date: `Day ${i + 1}`,
                value: 150 + Math.random() * 50 + (i * 2), // Stock index simulation
                btc: btcPrice + (Math.random() * 1000 - 500) // BTC volatility simulation
            })),
            allocation: [
                { name: 'Stocks', value: 45, color: '#3b82f6' },
                { name: 'Crypto', value: 30, color: '#f59e0b' },
                { name: 'Bonds', value: 15, color: '#10b981' },
                { name: 'Cash', value: 10, color: '#64748b' },
            ]
        }
    }
}
