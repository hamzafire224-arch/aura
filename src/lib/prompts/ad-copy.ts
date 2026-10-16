export function getAdCopyPrompt({
    productName,
    platform,
    targetAudience,
    tone,
    features
}: {
    productName: string
    platform: string
    targetAudience: string
    tone: string
    features?: string
}) {
    return `
You are an expert direct-response copywriter. Write high-converting ad copy for the following product.

DETAILS:
- Product: ${productName}
- Platform: ${platform}
- Target Audience: ${targetAudience}
- Tone: ${tone}
${features ? `- Key Features/Benefits: ${features}` : ''}

Generate a JSON response with the following structure:

{
  "headline": "Attention-grabbing headline (under 50 chars)",
  "primary_text": "The main ad body text. Use AIDA framework (Attention, Interest, Desire, Action).",
  "headline_variation": "Alternative headline",
  "cta": "Call to Action button text (e.g., Shop Now, Learn More)"
}

Keep it punchy, engaging, and compliant with ${platform} ad policies.
`;
}
