import { generateContent } from "../ai/providers"

export type FinancialHealth = {
    status: "Healthy" | "Caution" | "Critical"
    score: number
    summary: string
    recommendations: string[]
}

export type ReinvestmentPlan = {
    totalProfit: number
    allocations: {
        category: string
        percentage: number
        amount: number
        reasoning: string
    }[]
    projectedGrowth: string
}

export class FinancialAdvisor {

    async analyzeHealth(data: any): Promise<FinancialHealth> {
        const prompt = `
            You are AURA's Financial Co-Pilot.
            
            TASK:
            Analyze the following monthly financial data for a small business.
            
            DATA:
            ${JSON.stringify(data)}
            
            OUTPUT (JSON ONLY):
            {
                "status": "Healthy" | "Caution" | "Critical",
                "score": 0-100,
                "summary": "One sentence summary of financial health.",
                "recommendations": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
            }
            
            IMPORTANT: Return ONLY the JSON object.
        `

        const result = await generateContent({
            prompt,
            type: 'financial_planning',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    async generateReinvestmentPlan(profit: number, riskProfile: string = "Balanced"): Promise<ReinvestmentPlan> {
        const prompt = `
            You are an expert CFO.
            
            TASK:
            Create a reinvestment strategy for a monthly profit of $${profit}.
            Risk Profile: ${riskProfile}
            
            OUTPUT (JSON ONLY):
            {
                "totalProfit": ${profit},
                "allocations": [
                    {
                        "category": "Ad Spend" | "Inventory" | "Emergency Fund" | "Education" | "Software",
                        "percentage": 0-100,
                        "amount": 0,
                        "reasoning": "Why this amount?"
                    },
                    ...
                ],
                "projectedGrowth": "Estimated impact of this plan (e.g. '15% revenue increase')"
            }
            
            IMPORTANT: Return ONLY the JSON object.
        `

        const result = await generateContent({
            prompt,
            type: 'financial_planning',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    private parseJson(content: string): any {
        try {
            const clean = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            try {
                const start = content.indexOf('{')
                const end = content.lastIndexOf('}')
                if (start !== -1 && end !== -1) {
                    return JSON.parse(content.substring(start, end + 1))
                }
            } catch (e2) {
                console.error("Financial Advisor JSON Parse Error", content)
                throw new Error("Failed to parse Financial Advisor response")
            }
            throw e
        }
    }
}
