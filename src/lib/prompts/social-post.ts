export function getSocialPostPrompt({
    businessName,
    platform,
    topic,
    tone,
    targetAudience
}: {
    businessName: string
    platform: 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin'
    topic: string
    tone: string
    targetAudience: string
}): string {
    const platformGuidelines = {
        instagram: {
            maxLength: 2200,
            style: 'Visual storytelling, line breaks, emojis, 20-30 hashtags'
        },
        tiktok: {
            maxLength: 150,
            style: 'Short, punchy, Gen Z language'
        },
        facebook: {
            maxLength: 5000,
            style: 'Engaging, community-focused, moderate emoji use'
        },
        twitter: {
            maxLength: 280,
            style: 'Concise, hashtags, threads if needed'
        },
        linkedin: {
            maxLength: 3000,
            style: 'Professional insights, thought leadership'
        }
    }

    const guide = platformGuidelines[platform]

    return `
Create ${platform} post for ${businessName}.

TOPIC: ${topic}
TONE: ${tone}
AUDIENCE: ${targetAudience}

GUIDELINES:
- Max: ${guide.maxLength} chars
- Style: ${guide.style}

Generate JSON:

{
  "hook": "Attention-grabbing first line",
  "body": "Main content following platform best practices",
  "cta": "Clear call-to-action",
  "hashtags": ["relevant hashtags"],
  "emojis": ["suggested emojis"],
  "bestPostingTime": "Recommended time",
  "alternateVersions": ["2 variations for A/B testing"]
}

RULES:
- Platform-appropriate
- Audience-relevant
- Natural hashtags
- Specific CTA
`
}
