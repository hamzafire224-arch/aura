import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Link } from "react-router-dom"

const faqs = [
    {
        question: "What is AURA?",
        answer: "AURA is a Universal Business Operating System (BOS). It unifies specialized AI Agents, automated workflows, and financial tools into one platform, allowing solopreneurs to run complex businesses without a team."
    },
    {
        question: "How does the 'One-Prompt Launch' work?",
        answer: "Our Genesis Engine analyzes your niche and instantly generates your branding, mission, target audience, and initial digital assets. It also sets up your CRM and financial dashboard in the background."
    },
    {
        question: "What AI models does AURA use?",
        answer: "We use a hybrid architecture. For reasoning and strategy, we leverage Anthropic's Claude 3.5 Sonnet. For creative visuals, we use DALL-E 3. For fast data processing and search, we use Google's Gemini Pro and Tavily."
    },
    {
        question: "Is my business data private?",
        answer: "Yes. Your data is isolated in your secure workspace. We do not train our public models on your proprietary business data or financial records."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely. You can cancel, upgrade, or downgrade your plan directly from the Settings dashboard. Changes take effect immediately for upgrades and at the end of the cycle for cancellations."
    },
    {
        question: "Do you offer an Affiliate Program?",
        answer: "Yes! All AURA users get instant access to our Affiliate System. You can earn up to 30% recurring commission for every user you refer."
    },
    {
        question: "What happens if I run out of AI credits?",
        answer: "You can purchase 'Credit Top-ups' at any time without upgrading your plan, or simply wait for your monthly refill date."
    },
    {
        question: "Can I connect my own domain?",
        answer: "Yes, Pro and Enterprise plans support custom domains for your public-facing pages and assets."
    }
]

export default function FAQSection() {
    return (
        <section className="w-full py-24 bg-black/20">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know about running your business on AURA.
                    </p>

                    <div className="relative max-w-md mx-auto mt-8">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search questions..."
                            className="pl-10 bg-background/50 border-white/10"
                        />
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg px-6 bg-card/30">
                            <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-medium">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">Still have questions?</p>
                    <Link to="/contact">
                        <Button variant="outline" size="lg">Contact Support</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
