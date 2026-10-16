export function getVideoScriptPrompt({
    topic,
    platform,
    targetAudience,
    tone,
    duration
}: {
    topic: string
    platform: string
    targetAudience: string
    tone: string
    duration?: string
}) {
    return `
You are a viral video scriptwriter. Write a script for a short-form video.

DETAILS:
- Topic: ${topic}
- Platform: ${platform} (TikTok/Reels/Shorts)
- Target Audience: ${targetAudience}
- Tone: ${tone}
${duration ? `- Target Duration: ${duration}` : ''}

Generate a JSON response with the following structure:

{
  "title": "Video concept title",
  "hook": "Visual or audio hook to grab attention in first 3 seconds",
  "script": [
    {
      "time": "0:00-0:03",
      "visual": "Description of what is seen",
      "audio": "Spoken words or sound effect"
    },
    {
      "time": "0:03-0:15",
      "visual": "...",
      "audio": "..."
    }
  ],
  "caption": "Caption for the post including hashtags"
}

Focus on retention and engagement.
`;
}
