import { useState } from "react"
import { useCredits } from "@/hooks/use-credits"
import { LeadAgent, type Lead } from "@/lib/ai/lead-agent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, Lock, UserPlus, Download, Mail, ExternalLink, Send } from "lucide-react"
import { toast } from "sonner"

// Helper for safe URL parsing
function safeGetHostname(url: string | undefined | null): string | null {
    if (!url) return null
    try {
        return new URL(url).hostname
    } catch {
        return url // Fallback to raw string if parsing fails
    }
}

export default function Leads() {
    const { checkCredits, spendCredits, business } = useCredits()
    const [leads, setLeads] = useState<Lead[]>([])

    // Search State
    const [niche, setNiche] = useState("")
    const [location, setLocation] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    // Access Check - Allow agency tier or enterprise (for legacy)
    const isOrgTier = business?.tier === 'agency' || business?.tier === 'enterprise' || business?.tier === 'professional'
    // Actually per plan: Agency Tier for leads feature.

    const handleSearch = async () => {
        if (!niche || !location) {
            toast.error("Please enter both niche and location")
            return
        }

        // Cost Check: 5 * 50 = 250 credits for a batch of 5? 
        // Or pay per lead "Reveal"? 
        // Plan says "50 Credits / lead". 
        // Let's find them first (Show hidden data), then pay to "Enrich/Unlock"?
        // Or pay upfront for the search? 
        // Let's pay upfront for the search result batch to keep it simple.
        // Say 50 credits for the SEARCH operation (finding 5 leads).

        const SEARCH_COST = 50

        if (!checkCredits(SEARCH_COST)) return

        setIsSearching(true)
        try {
            const agent = new LeadAgent()
            const results = await agent.findLeads(niche, location)

            setLeads(prev => [...results, ...prev])
            await spendCredits(SEARCH_COST)
            toast.success(`Found ${results.length} new leads!`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to find leads. Check API keys.")
        } finally {
            setIsSearching(false)
        }
    }

    const handleEnrich = async (leadId: string) => {
        // Feature: Unlock "Direct Contact" info
        const UNLOCK_COST = 10
        if (!checkCredits(UNLOCK_COST)) return

        try {
            const agent = new LeadAgent()
            const leadIndex = leads.findIndex(l => l.id === leadId)
            if (leadIndex === -1) return

            // Optimistic toggle loaded state? 
            // Just simulate enrichment
            const updatedLead = await agent.enrichLead(leads[leadIndex])

            const newLeads = [...leads]
            newLeads[leadIndex] = updatedLead
            setLeads(newLeads)

            await spendCredits(UNLOCK_COST)
            toast.success("Lead enriched!")
        } catch (e) {
            toast.error("Failed to enrich lead")
        }
    }

    const handleReachout = async (lead: Lead) => {
        if (lead.status === 'Contacted') {
            toast.info("Already contacted this lead.")
            return
        }

        const REACHOUT_COST = 25
        if (!checkCredits(REACHOUT_COST)) return

        const offer = prompt("What is your pitch/offer for this lead?", "We help agencies scale with AI tools.")
        if (!offer) return

        toast.info("Sales Agent is crafting and sending email...")

        try {
            const { SalesAgent } = await import("@/lib/ai/sales-agent")
            const agent = new SalesAgent()

            // 1. Generate Content
            const emailContent = await agent.generateOutreach(lead, business?.name || "AURA User", offer)

            // 2. Send Email
            const result = await agent.sendOutreach(lead, emailContent)

            if (result.success) {
                toast.success(`Email sent to ${lead.contactName}!`)
                await spendCredits(REACHOUT_COST)

                // Update status
                setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Contacted' } : l))
            } else {
                throw new Error('error' in result ? String((result as any).error?.message || result.error) : "Send failed")
            }

        } catch (error: any) {
            console.error("Reachout failed:", error)
            toast.error("Failed to send email. Check API Keys.")
        }
    }

    if (!isOrgTier && business) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Organization Tier Only</h2>
                <p className="text-muted-foreground max-w-md">
                    Upgrade to the Organization plan to access the B2B Lead Finder and CRM features.
                </p>
                <Button onClick={() => window.location.href = '/dashboard/settings'}>View Plans</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lead Finder</h1>
                    <p className="text-muted-foreground">Find and enrich B2B leads in your niche.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="bg-muted/30 border-primary/10">
                <CardContent className="pt-6">
                    <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Niche / Industry</label>
                            <Input
                                placeholder="e.g. Marketing Agencies, Dentists..."
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                                placeholder="e.g. New York, London..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isSearching} className="w-full md:w-auto">
                            {isSearching ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
                            Find Leads
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No leads found. Start a search above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">
                                        <div>{lead.companyName}</div>
                                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
                                            {safeGetHostname(lead.website)} <ExternalLink className="h-2 w-2" />
                                        </a>
                                    </TableCell>
                                    <TableCell>{lead.industry}</TableCell>
                                    <TableCell>{lead.location}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{lead.contactName}</span>
                                            <span className="text-xs text-muted-foreground">{lead.role}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={lead.status === 'Qualified' ? 'default' : 'secondary'}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => window.location.href = `mailto:${lead.email}`}>
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
                                                onClick={() => handleReachout(lead)}
                                            >
                                                <Send className="h-4 w-4 mr-1" />
                                                Autopilot
                                            </Button>
                                            <Button size="sm" onClick={() => handleEnrich(lead.id)} disabled={lead.status === 'Qualified'}>
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Enrich
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
