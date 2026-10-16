export function getProductDescriptionPrompt({
    productName,
    features,
    targetAudience,
    priceRange
}: {
    productName: string
    features: string[]
    targetAudience: string
    priceRange?: string
}): string {
    return `
Create compelling product description:

PRODUCT: ${productName}
FEATURES: ${features.join(', ')}
AUDIENCE: ${targetAudience}
${priceRange ? `PRICE: ${priceRange}` : ''}

Generate JSON:

{
  "title": "SEO-optimized title (60 chars, include benefit)",
  "shortDescription": "One sentence (120 chars)",
  "longDescription": "200-300 words:
    - Hook that creates desire
    - Features as benefits
    - Social proof
    - Use cases
    - Strong CTA",
  "bulletPoints": ["5-7 benefit-focused points"],
  "seoKeywords": ["10 relevant keywords"],
  "metaDescription": "SEO meta (155 chars)"
}

STYLE:
- Second person ("you")
- Benefits over features
- Sensory language
- Subtle urgency
- Match audience tone
`
}
