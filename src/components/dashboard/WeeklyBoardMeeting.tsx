import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { generateContent } from "@/lib/ai/providers"
import { toast } from "sonner"
import { useBusiness, type Business } from "@/contexts/BusinessContext"

interface WeeklyBoardMeetingProps {
    business: Business
}

export function WeeklyBoardMeeting({ business }: WeeklyBoardMeetingProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [report, setReport] = useState<any>(null)
    const { updateBusiness } = useBusiness()

    useEffect(() => {
        checkMeetingEligibility()
    }, [business])

    const checkMeetingEligibility = () => {
        if (!business) return

        const today = new Date()
        const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
        const lastMeeting = business.lastBoardMeeting ? new Date(business.lastBoardMeeting) : null

        // Logic:
        // 1. If it's Saturday (6) or Sunday (0), AND we haven't had a meeting this week -> Trigger
        // 2. If user has NEVER had a meeting -> Trigger (Welcome Meeting)

        const isWeekend = dayOfWeek === 6 || dayOfWeek === 0
        const isFirstTime = !lastMeeting

        let shouldOpen = false

        if (isFirstTime) {
            shouldOpen = true
        } else if (isWeekend) {
            // Check if we already had a meeting this weekend
            const timeDiff = today.getTime() - lastMeeting.getTime()
            const daysDiff = timeDiff / (1000 * 3600 * 24)

            if (daysDiff > 5) { // If last meeting was more than 5 days ago (i.e., last week)
                shouldOpen = true
            }
        }

        if (shouldOpen) {
            const timer = setTimeout(() => setIsOpen(true), 2000)
            return () => clearTimeout(timer)
        }
    }

    const startMeeting = async () => {
        setIsLoading(true)
        try {
            // Use REAL data from context
            const context = {
                businessName: business.name,
                industry: business.industry,
                revenue: `$${business.revenue}`,
                expenses: `$${business.expenses}`,
                profit: `$${business.profit}`,
                visitors: business.visitors,
                orders: business.orders,
                conversionRate: `${business.conversionRate}%`
            }

            const prompt = `
                You are the Chairman of the Board for ${business.name} (${business.industry}).
                
                CONTEXT (Actual Data):
                ${JSON.stringify(context)}
                
                TASK:
                Conduct a "Weekly Board Meeting".
                1. Analyze the REAL data provided above. If revenue is 0, acknowledge it honestly and focus on "Getting Started".
                2. If revenue > 0, highlight wins.
                3. Set 3 strategic priorities for the week based on the ACTUAL state (e.g. if 0 visitors, priority is Traffic).
                
                OUTPUT (JSON ONLY):
                {
                    "opening": "Motivational opening statement based on data.",
                    "wins": ["Win 1", "Win 2"],
                    "risks": ["Risk 1", "Risk 2"],
                    "priorities": [
                        { "title": "Priority 1", "action": "Specific action to take" },
                        { "title": "Priority 2", "action": "Specific action to take" },
                        { "title": "Priority 3", "action": "Specific action to take" }
                    ]
                }
                
                IMPORTANT: Return ONLY the JSON object.
            `

            const result = await generateContent({
                prompt,
                type: 'business_strategy',
                userId: 'system',
                preferredProvider: 'gemini'
            })

            const cleanJson = result.content.replace(/```json\n?|\n?```/g, '')
            setReport(JSON.parse(cleanJson))

            // Mark as seen in Context
            updateBusiness(business.id, {
                lastBoardMeeting: new Date().toISOString()
            })

        } catch (error) {
            console.error("Board meeting failed:", error)
            toast.error("The board is unavailable right now.")
            setIsOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {!report && !isLoading ? (
                    <div className="text-center space-y-6 py-8">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl">Weekly Board Meeting</DialogTitle>
                            <DialogDescription className="text-base">
                                Your AI Board of Advisors is ready to review your performance and set strategy for the week ahead.
                            </DialogDescription>
                        </div>
                        <Button size="lg" onClick={startMeeting} className="w-full sm:w-auto">
                            <Sparkles className="mr-2 h-4 w-4" /> Start Meeting
                        </Button>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">The Board is reviewing your data...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Brain className="h-5 w-5 text-primary" />
                                Board Meeting Minutes
                            </DialogTitle>
                            <DialogDescription>
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <p className="italic text-sm text-muted-foreground">"{report.opening}"</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-green-600">
                                    <TrendingUp className="h-4 w-4" /> Wins / Positives
                                </h4>
                                <ul className="space-y-2">
                                    {report.wins.map((win: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                                            {win}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-amber-600">
                                    <AlertTriangle className="h-4 w-4" /> Risks / Focus Areas
                                </h4>
                                <ul className="space-y-2">
                                    {report.risks.map((risk: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="font-semibold flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-primary" />
                                Strategic Priorities
                            </h4>
                            <div className="space-y-3">
                                {report.priorities.map((p: any, i: number) => (
                                    <div key={i} className="bg-secondary/30 p-3 rounded-lg border">
                                        <div className="font-medium text-sm">{p.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{p.action}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setIsOpen(false)} className="w-full">
                                I'm Ready to Execute
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
