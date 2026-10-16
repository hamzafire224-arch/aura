import { generateContent } from "./providers"

export type PRD = {
    title: string
    overview: string
    targetAudience: string
    coreFeatures: Array<{ name: string, description: string, priority: "High" | "Medium" | "Low" }>
    techStack: {
        frontend: string
        backend: string
        database: string
        hosting: string
    }
    databaseSchema: Array<{ table: string, columns: string[] }>
    roadmap: string[]
}

export type WaitlistCopy = {
    headline: string
    subheadline: string
    benefits: string[]
    cta: string
    successMessage: string
}

export class SaaSArchitectAgent {

    async generatePRD(idea: string, niche: string): Promise<PRD> {
        const prompt = `
            You are a Senior Product Manager and CTO.
            
            TASK:
            Create a comprehensive Product Requirements Document (PRD) for a new SaaS idea.
            Idea: "${idea}"
            Niche: "${niche}"
            
            REQUIREMENTS:
            - Define core features for an MVP.
            - Recommend a modern tech stack (e.g., React, Node, Supabase).
            - Design a basic database schema.
            
            OUTPUT (JSON ONLY):
            {
                "title": "App Name",
                "overview": "Executive summary...",
                "targetAudience": "User persona...",
                "coreFeatures": [
                    { "name": "Feature 1", "description": "Details...", "priority": "High" }
                ],
                "techStack": {
                    "frontend": "React + Vite",
                    "backend": "Node.js (Express)",
                    "database": "PostgreSQL (Supabase)",
                    "hosting": "Vercel"
                },
                "databaseSchema": [
                    { "table": "users", "columns": ["id", "email", "created_at"] }
                ],
                "roadmap": ["Phase 1: MVP", "Phase 2: Beta"]
            }
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    async generateWaitlistCopy(idea: string, niche: string): Promise<WaitlistCopy> {
        const prompt = `
            You are a Conversion Copywriter.
            
            TASK:
            Write high-converting copy for a pre-launch waitlist page.
            Idea: "${idea}"
            Niche: "${niche}"
            
            OUTPUT (JSON ONLY):
            {
                "headline": "Punchy, benefit-driven headline",
                "subheadline": "Clear explanation of value proposition",
                "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
                "cta": "Join the Waitlist",
                "successMessage": "Thanks for joining! You're on the list."
            }
        `

        const result = await generateContent({
            prompt,
            type: 'ad_copy',
            userId: 'system',
            preferredProvider: 'auto'
        })

        return this.parseJson(result.content)
    }

    async generateStarterKit(idea: string, prd: PRD): Promise<any[]> {
        const prompt = `
            You are a Senior React Engineer.
            
            TASK:
            Generate a "Starter Kit" file structure for a Next.js 14 SaaS app based on this PRD.
            Idea: ${idea}
            Tech Stack: ${Object.values(prd.techStack).join(", ")}
            
            OUTPUT (JSON ONLY):
            Return an array of file objects.
            [
                {
                    "path": "package.json",
                    "content": "{\n  \"name\": \"${idea.toLowerCase().replace(/\s+/g, '-')}\",\n  \"version\": \"0.1.0\",\n  \"dependencies\": {\n    \"next\": \"14.0.0\",\n    \"react\": \"^18\",\n    \"lucide-react\": \"latest\"\n  }\n}"
                },
                {
                    "path": "README.md",
                    "content": "# ${idea}\n\n${prd.overview}\n\n## Getting Started\n\n\`\`\`bash\nnpm run dev\n\`\`\`"
                },
                {
                    "path": "app/page.tsx",
                    "content": "import { Button } from '@/components/ui/button'\n\nexport default function Home() {\n  return (\n    <main className=\"flex min-h-screen flex-col items-center justify-between p-24\">\n      <h1 className=\"text-4xl font-bold\">${idea}</h1>\n      <p className=\"text-xl\">${(prd.coreFeatures && prd.coreFeatures.length > 0) ? prd.coreFeatures[0].name : 'Building something amazing.'}</p>\n      <Button>Get Started</Button>\n    </main>\n  )\n}"
                }
            ]
            
            Generate at least 5 core files (package.json, README.md, app/page.tsx, app/layout.tsx, .env.example).
        `

        const result = await generateContent({
            prompt,
            type: 'code_generation',
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
            const start = content.indexOf('[')
            const end = content.lastIndexOf(']')
            if (start !== -1 && end !== -1) {
                return JSON.parse(content.substring(start, end + 1))
            }
            return []
        }
    }
}
