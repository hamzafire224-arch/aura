export function getBusinessGenerationPrompt(userInput: string): string {
    return `
You are AURA, an expert business strategist. Generate a comprehensive business foundation.

USER INPUT:
"${userInput}"

Generate in JSON format:

{
  "businessName": "Catchy, memorable brand name (2-3 words). Make it unique.",
  "tagline": "Compelling one-line tagline (max 60 chars)",
  "missionStatement": "Clear mission (2-3 sentences)",
  "industry": "Primary industry category",
  "targetAudience": {
    "primary": "Main demographic",
    "secondary": "Secondary audience",
    "painPoints": ["3-5 pain points this solves"]
  },
  "brandIdentity": {
    "personality": ["3-5 brand traits"],
    "toneOfVoice": "Communication style",
    "values": ["3-5 core values"]
  },
  "colorPalette": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode"
  },
  "uniqueSellingPropositions": ["3 key USPs"],
  "productStrategy": {
    "pricingTier": "budget/mid-range/premium",
    "suggestedPriceRange": "e.g., $30-$80",
    "productCategories": ["3-5 categories"]
  },
  "marketingAngles": ["5 content themes"],
  "firstMonthGoals": ["3 achievable goals"],
  "contentIdeas": {
    "socialPosts": ["5 post ideas"],
    "blogTopics": ["3 blog topics"]
  }
}

IMPORTANT:
- Be specific and actionable
- Brand name must be unique
- Colors should be professional
- USPs must be concrete
- Make it exciting!
`
}
