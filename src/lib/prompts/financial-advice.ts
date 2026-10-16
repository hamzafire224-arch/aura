export function getFinancialInsightsPrompt({
    revenue,
    expenses,
    profit,
    previousRevenue,
    businessType,
    goals
}: {
    revenue: number
    expenses: number
    profit: number
    previousRevenue?: number
    businessType: string
    goals?: string
}) {
    return `
You are AURA's Chief Financial Officer AI, an expert in business finance and strategy. Analyze the following financial data and provide actionable insights.

BUSINESS DATA:
- Business Type: ${businessType}
- Current Revenue: $${revenue}
- Current Expenses: $${expenses}
- Net Profit: $${profit}
${previousRevenue ? `- Previous Period Revenue: $${previousRevenue}` : ''}
${goals ? `- Financial Goals: ${goals}` : ''}

Generate a JSON response with the following structure:

{
  "analysis": "Brief analysis of the current financial health (2-3 sentences).",
  "insights": [
    "Key insight 1 (e.g., regarding profit margin)",
    "Key insight 2 (e.g., regarding expense ratio)",
    "Key insight 3 (e.g., growth trend)"
  ],
  "recommendations": [
    {
      "title": "Actionable Recommendation 1",
      "description": "Specific steps to take.",
      "impact": "Estimated impact (e.g., 'Could increase margins by 5%')"
    },
    {
      "title": "Actionable Recommendation 2",
      "description": "Specific steps to take.",
      "impact": "Estimated impact"
    }
  ],
  "investment_opportunities": [
    "Suggestion for reinvestment 1",
    "Suggestion for reinvestment 2"
  ]
}

Focus on practical, high-impact advice suitable for a solopreneur or small business owner. Be encouraging but realistic.
`;
}
