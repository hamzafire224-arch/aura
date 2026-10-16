export function getBlogPostPrompt({
    topic,
    targetAudience,
    tone,
    keywords
}: {
    topic: string
    targetAudience: string
    tone: string
    keywords?: string
}) {
    return `
You are an expert SEO content writer. Write a comprehensive blog post outline and intro for the following topic.

DETAILS:
- Topic: ${topic}
- Target Audience: ${targetAudience}
- Tone: ${tone}
${keywords ? `- Keywords to target: ${keywords}` : ''}

Generate a JSON response with the following structure:

{
  "title": "SEO-optimized catchy title",
  "meta_description": "150-160 characters summary for search engines",
  "introduction": "Engaging introduction (approx 100 words) that hooks the reader.",
  "outline": [
    {
      "heading": "Section 1 Heading",
      "points": ["Key point 1", "Key point 2"]
    },
    {
      "heading": "Section 2 Heading",
      "points": ["Key point 1", "Key point 2"]
    }
  ],
  "conclusion": "Brief wrapping up paragraph."
}

Ensure the content is valuable, easy to read, and structured for the web.
`;
}
