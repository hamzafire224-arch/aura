import { searchTavily, generateContent } from "@/lib/ai/providers"

export class YCAgent {

    /**
     * Ask a startup question and get an answer in the style of Paul Graham / YC Partners.
     */
    async ask(question: string): Promise<string> {
        console.log(`YCAgent: Asking "${question}"`)

        // 1. Search YC Library
        const query = `"${question}" startup advice`
        const searchResults = await searchTavily(query, 'advanced', {
            include_domains: ["ycombinator.com", "paulgraham.com"]
        })

        // 2. RAG Synthesis
        const prompt = `
        You are Paul Graham (PG) and a YC Group Partner.
        User Question: "${question}"

        Context from YC Library:
        ${searchResults}

        Instructions:
        - Answer the question directly using the wisdom from the context.
        - Use a direct, essay-like tone (PG style).
        - Be counter-intuitive if the query implies a common mistake (e.g., "how to scale" -> "do things that don't scale").
        - Cite specific essays or YC partners if found in context.
        - Keep it under 250 words.
        `

        const { content } = await generateContent({
            prompt: prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return content
    }

    /**
     * Returns the standard YC Startup School Curriculum Roadmap
     */
    getCurriculum() {
        return [
            { id: 'week1', title: 'Idea Generation', description: 'How to evaluate startup ideas.', action: 'Read "How to Get Startup Ideas"', status: 'completed' },
            { id: 'week2', title: 'Talk to Users', description: 'The Mom Test and invalidating hypotheses.', action: 'Do 5 User Interviews', status: 'current' },
            { id: 'week3', title: 'Build MVP', description: 'Launch something bad, quickly.', action: 'Ship V1', status: 'locked' },
            { id: 'week4', title: 'Launch', description: 'Getting your first users.', action: 'Launch on HN/PH', status: 'locked' }
        ]
    }
}
