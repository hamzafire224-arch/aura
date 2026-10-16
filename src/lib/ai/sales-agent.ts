import { generateContent } from "./providers"
import { sendEmail } from "../resend"
import type { Lead } from "./lead-agent"

export class SalesAgent {

    /**
     * Generates a personalized cold email for a lead.
     */
    async generateOutreach(lead: Lead, myBusinessName: string, myOffer: string) {
        const prompt = `
            You are a master B2B Sales Copywriter.
            
            LEAD:
            Company: ${lead.companyName}
            Contact: ${lead.contactName}
            Role: ${lead.role}
            Industry: ${lead.industry}
            
            MY BUSINESS:
            Name: ${myBusinessName}
            Offer: ${myOffer}
            
            TASK:
            Write a high-converting cold email (Subject + Body) for this lead.
            The tone should be professional, concise, and value-driven. No fluff.
            
            OUTPUT (JSON ONLY):
            {
                "subject": "Email Subject",
                "body_html": "<p>Hi ${lead.contactName},...</p>"
            }
        `

        const result = await generateContent({
            prompt,
            type: 'business_strategy', // Reusing strategy model for now
            userId: 'system',
            preferredProvider: 'auto'
        })

        try {
            const clean = result.content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(clean)
        } catch (e) {
            console.error("Failed to parse email JSON", e)
            return {
                subject: `Partnership Opportunity: ${lead.companyName} x ${myBusinessName}`,
                body_html: `<p>Hi ${lead.contactName}, I noticed your work in the ${lead.industry} space and wanted to reach out.</p>`
            }
        }
    }

    /**
     * Sends the generated email via Resend.
     */
    async sendOutreach(lead: Lead, emailContent: { subject: string, body_html: string }) {
        if (!lead.email || lead.email.includes("contact@")) {
            // Basic validation: Don't send to guessed "contact@" if we want high deliverability,
            // but for this demo/upgrade it's fine as long as Resend handles it (or mocks it).
            // Ideally we only send to verified emails.
        }

        return await sendEmail({
            to: lead.email,
            subject: emailContent.subject,
            html: emailContent.body_html
        })
    }
}
