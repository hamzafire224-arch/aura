import { useState, useEffect, useMemo, useCallback } from "react"
import { WorkflowCard, type KanbanTask, type KanbanTaskStatus } from "./WorkflowCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { 
    Plus, 
    Sparkles, 
    RefreshCw, 
    Bot, 
    Coins, 
    Copy, 
    Check, 
    CheckCircle2, 
    Loader2, 
    Layers, 
    Play,
    Cpu
} from "lucide-react"
import { useBusiness } from "@/contexts/BusinessContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export const KANBAN_COLUMNS: {
    id: KanbanTaskStatus
    title: string
    color: string
    badgeColor: string
    description: string
}[] = [
    { 
        id: "todo", 
        title: "Directives Queue", 
        color: "border-zinc-500/20 text-zinc-300", 
        badgeColor: "bg-zinc-500/20 text-zinc-300",
        description: "Backlog & strategic directives"
    },
    { 
        id: "in_progress", 
        title: "Agent Execution", 
        color: "border-cyan-500/30 text-cyan-400", 
        badgeColor: "bg-cyan-500/20 text-cyan-300",
        description: "Active neural gateway inference"
    },
    { 
        id: "review", 
        title: "Telemetry Review", 
        color: "border-amber-500/30 text-amber-400", 
        badgeColor: "bg-amber-500/20 text-amber-300",
        description: "Pending verification & approval"
    },
    { 
        id: "completed", 
        title: "Mission Complete", 
        color: "border-emerald-500/30 text-emerald-400", 
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        description: "Outputs archived & ledger settled"
    },
]

const AGENT_TYPES = [
    { id: "general_agent", name: "General Strategic Operator", cost: 1, desc: "Autonomous multi-purpose directive execution" },
    { id: "spy_node", name: "Competitor Recon Specialist", cost: 2, desc: "Deep store pricing, margin & traffic infiltration" },
    { id: "market_analyst", name: "Market & Trend Synthesis", cost: 2, desc: "Predictive consumer trends and arbitrage finder" },
    { id: "content_creator", name: "Brand & Copywriting Architect", cost: 1, desc: "High-conversion product copy and ad hooks" },
    { id: "seo_optimizer", name: "Search Intelligence Scout", cost: 1, desc: "Metadata, ranking factors & keyword domination" },
]

export function KanbanBoard() {
    const { businesses } = useBusiness()
    const activeBusiness = businesses[0]

    const [tasks, setTasks] = useState<KanbanTask[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [executingTaskIds, setExecutingTaskIds] = useState<Set<string>>(new Set())
    const [dragOverCol, setDragOverCol] = useState<string | null>(null)

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [inspectTask, setInspectTask] = useState<KanbanTask | null>(null)
    const [copiedOutput, setCopiedOutput] = useState(false)

    // Form inputs for new directive
    const [formTitle, setFormTitle] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formAgentType, setFormAgentType] = useState("general_agent")
    const [formIntent, setFormIntent] = useState("")
    const [formPrompt, setFormPrompt] = useState("")
    const [formCost, setFormCost] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. REAL-TIME FETCHING & POSTGRES SUBSCRIPTION
    const fetchTasks = useCallback(async (showLoader = false) => {
        if (!activeBusiness?.id) {
            setTasks([])
            setIsLoading(false)
            return
        }

        if (showLoader) setIsLoading(true)
        else setIsRefreshing(true)

        const { data, error } = await supabase
            .from("kanban_tasks")
            .select("*")
            .eq("business_id", activeBusiness.id)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error loading kanban tasks:", error)
            toast.error("Failed to load Kanban tasks: " + error.message)
        } else {
            setTasks(data || [])
        }

        setIsLoading(false)
        setIsRefreshing(false)
    }, [activeBusiness?.id])

    useEffect(() => {
        if (!activeBusiness?.id) {
            setIsLoading(false)
            return
        }

        let isMounted = true
        fetchTasks(true)

        // Real-Time Postgres Channel
        const channel = supabase
            .channel(`kanban_tasks_${activeBusiness.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "kanban_tasks",
                    filter: `business_id=eq.${activeBusiness.id}`,
                },
                (payload) => {
                    if (!isMounted) return

                    if (payload.eventType === "INSERT") {
                        setTasks((prev) => {
                            if (prev.some((t) => t.id === payload.new.id)) return prev
                            return [payload.new as KanbanTask, ...prev]
                        })
                    } else if (payload.eventType === "UPDATE") {
                        setTasks((prev) =>
                            prev.map((t) => (t.id === payload.new.id ? (payload.new as KanbanTask) : t))
                        )
                        // If inspecting the updated task, refresh the modal
                        setInspectTask((curr) => (curr?.id === payload.new.id ? (payload.new as KanbanTask) : curr))
                    } else if (payload.eventType === "DELETE") {
                        setTasks((prev) => prev.filter((t) => t.id !== (payload.old as any).id))
                        setInspectTask((curr) => (curr?.id === (payload.old as any).id ? null : curr))
                    }
                }
            )
            .subscribe()

        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [activeBusiness?.id, fetchTasks])

    // Update form cost when agent type changes
    useEffect(() => {
        const selected = AGENT_TYPES.find((a) => a.id === formAgentType)
        if (selected) {
            setFormCost(selected.cost)
        }
    }, [formAgentType])

    // 2. AGENT EXECUTION TRIGGER (WIRED TO EDGE FUNCTION agent-gateway)
    const triggerAgentExecution = async (task: KanbanTask) => {
        if (!activeBusiness?.id) {
            toast.error("No active business selected.")
            return
        }

        if (executingTaskIds.has(task.id)) return

        setExecutingTaskIds((prev) => new Set(prev).add(task.id))
        toast.info(`Executing Directive: "${task.title}"`, {
            description: `Invoking agent-gateway (${task.agent_type}, ${task.credits_cost} credits)...`,
        })

        try {
            // Call centralized agent-gateway Edge Function
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke("agent-gateway", {
                body: {
                    businessId: activeBusiness.id,
                    agentType: task.agent_type || "general_agent",
                    intent: task.intent || task.title,
                    prompt: task.prompt_payload || task.description || task.title,
                    creditsCost: Number(task.credits_cost) || 1,
                },
            })

            // Error Handling
            if (edgeError) {
                console.error("Agent gateway execution failed:", edgeError)
                const errorMsg = edgeError.message || ""
                const isInsufficientCredits =
                    errorMsg.includes("402") ||
                    errorMsg.toLowerCase().includes("insufficient") ||
                    (edgeError as any)?.context?.status === 402 ||
                    (edgeError as any)?.status === 402

                if (isInsufficientCredits) {
                    toast.error("Insufficient Credits (402)", {
                        description: `Directive "${task.title}" aborted. Cost: ${task.credits_cost} credits. Please top up your treasury balance.`,
                    })

                    // Revert task back to 'todo'
                    await supabase
                        .from("kanban_tasks")
                        .update({ status: "todo" })
                        .eq("id", task.id)

                    setTasks((prev) =>
                        prev.map((t) => (t.id === task.id ? { ...t, status: "todo" } : t))
                    )
                    return
                }

                // Generic error - update to 'failed'
                toast.error("Agent Inference Failed", {
                    description: errorMsg || "Agent could not complete directive.",
                })

                await supabase
                    .from("kanban_tasks")
                    .update({ status: "failed" })
                    .eq("id", task.id)

                setTasks((prev) =>
                    prev.map((t) => (t.id === task.id ? { ...t, status: "failed" } : t))
                )
                return
            }

            // Success Handling
            const outputText =
                edgeData?.output ||
                edgeData?.result ||
                `[AURA AGENT COMPLETE]\nDirective executed successfully.`

            toast.success(`Directive Complete: "${task.title}"`, {
                description: `Settled ${task.credits_cost} credit(s). Telemetry archived.`,
            })

            // Update database: move to completed (or review) and append execution notes
            const finalDescription = task.description
                ? `${task.description}\n\n====================\nAGENT EXECUTION OUTPUT\n====================\n${outputText}`
                : `====================\nAGENT EXECUTION OUTPUT\n====================\n${outputText}`

            await supabase
                .from("kanban_tasks")
                .update({
                    status: "completed",
                    description: finalDescription,
                })
                .eq("id", task.id)

            setTasks((prev) =>
                prev.map((t) =>
                    t.id === task.id
                        ? { ...t, status: "completed", description: finalDescription }
                        : t
                )
            )
        } catch (err: any) {
            console.error("Fatal error triggering agent execution:", err)
            toast.error("Execution Fatal Error: " + (err.message || "Unknown error"))

            await supabase
                .from("kanban_tasks")
                .update({ status: "todo" })
                .eq("id", task.id)

            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, status: "todo" } : t))
            )
        } finally {
            setExecutingTaskIds((prev) => {
                const next = new Set(prev)
                next.delete(task.id)
                return next
            })
        }
    }

    // 3. MOVE TASK BETWEEN COLUMNS
    const handleMoveTask = async (taskId: string, newStatus: KanbanTaskStatus) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task || task.status === newStatus) return

        // Optimistic UI update
        const previousStatus = task.status
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        )

        const { error } = await supabase
            .from("kanban_tasks")
            .update({ status: newStatus })
            .eq("id", taskId)

        if (error) {
            console.error("Failed to update status:", error)
            toast.error("Status update failed: " + error.message)
            // Rollback optimistic update
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
            )
            return
        }

        // If moved to in_progress, trigger the Edge Gateway execution!
        if (newStatus === "in_progress") {
            await triggerAgentExecution({ ...task, status: newStatus })
        }
    }

    // 4. DELETE TASK
    const handleDeleteTask = async (taskId: string) => {
        const { error } = await supabase.from("kanban_tasks").delete().eq("id", taskId)

        if (error) {
            toast.error("Failed to delete task: " + error.message)
        } else {
            toast.success("Directive deleted from board.")
            setTasks((prev) => prev.filter((t) => t.id !== taskId))
            if (inspectTask?.id === taskId) setInspectTask(null)
        }
    }

    // 5. CREATE NEW DIRECTIVE
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeBusiness?.id) {
            toast.error("Active business profile required.")
            return
        }

        if (!formTitle.trim()) {
            toast.error("Please provide a title for the directive.")
            return
        }

        setIsSubmitting(true)

        const payloadPrompt = formPrompt.trim() || formDescription.trim() || formTitle.trim()
        const payloadIntent = formIntent.trim() || formTitle.trim()

        const newTaskPayload = {
            business_id: activeBusiness.id,
            title: formTitle.trim(),
            description: formDescription.trim() || null,
            status: "todo" as KanbanTaskStatus,
            agent_type: formAgentType,
            intent: payloadIntent,
            prompt_payload: payloadPrompt,
            credits_cost: Number(formCost) || 1,
        }

        const { data, error } = await supabase
            .from("kanban_tasks")
            .insert([newTaskPayload])
            .select()
            .single()

        if (error) {
            console.error("Error creating task:", error)
            toast.error("Failed to create task: " + error.message)
        } else if (data) {
            toast.success("New Directive Initialized in Queue.")
            setTasks((prev) => [data as KanbanTask, ...prev])

            // Reset form
            setFormTitle("")
            setFormDescription("")
            setFormIntent("")
            setFormPrompt("")
            setFormAgentType("general_agent")
            setFormCost(1)
            setIsCreateOpen(false)
        }

        setIsSubmitting(false)
    }

    // Copy output helper
    const handleCopyOutput = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedOutput(true)
        toast.success("Agent output copied to clipboard.")
        setTimeout(() => setCopiedOutput(false), 2000)
    }

    // Group tasks per column (Failed tasks show in Todo column with warning tag)
    const columnsMap = useMemo(() => {
        return {
            todo: tasks.filter((t) => t.status === "todo" || t.status === "failed"),
            in_progress: tasks.filter((t) => t.status === "in_progress"),
            review: tasks.filter((t) => t.status === "review"),
            completed: tasks.filter((t) => t.status === "completed"),
            failed: tasks.filter((t) => t.status === "failed"),
        }
    }, [tasks])

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    Establishing Neural Stream // Synchronizing Matrix...
                </p>
            </div>
        )
    }

    // Missing Business State
    if (!activeBusiness) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6 text-center">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                    <Bot className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Active Business Profile</h2>
                <p className="text-zinc-400 text-sm max-w-md mb-6">
                    Connect or select a business entity to mobilize autonomous AI agents and assign strategic directives.
                </p>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-6 pt-8 flex flex-col">
            {/* Top Command Bar */}
            <div className="max-w-7xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                            <Layers className="h-7 w-7 text-cyan-400" />
                            Agent Operation Kanban
                        </h1>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[10px] tracking-wider uppercase">
                            Autonomous Engine
                        </Badge>
                    </div>
                    <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Entity: <span className="text-zinc-200 font-semibold">{activeBusiness.name}</span>
                        <span className="text-zinc-600">//</span>
                        <span>{tasks.length} Directives Registered</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchTasks(false)}
                        disabled={isRefreshing}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 h-9"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        Sync
                    </Button>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-9 shadow-lg shadow-cyan-500/20"
                    >
                        <Plus className="mr-1.5 h-4 w-4" /> Initialize Directive
                    </Button>
                </div>
            </div>

            {/* Kanban Columns Grid */}
            <div className="flex-1 max-w-7xl mx-auto w-full flex gap-4 overflow-x-auto pb-6">
                {KANBAN_COLUMNS.map((col) => {
                    const columnTasks = columnsMap[col.id] || []
                    const isOver = dragOverCol === col.id

                    return (
                        <div
                            key={col.id}
                            className={`min-w-[310px] w-[310px] flex flex-col h-[calc(100vh-230px)] rounded-xl bg-zinc-950/40 border transition-all duration-200 ${
                                isOver
                                    ? "border-cyan-500/50 bg-cyan-950/10 ring-1 ring-cyan-500/30"
                                    : "border-white/5"
                            }`}
                        >
                            {/* Column Header */}
                            <div className="p-3.5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md rounded-t-xl sticky top-0 z-10">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                col.id === "todo"
                                                    ? "bg-zinc-400"
                                                    : col.id === "in_progress"
                                                    ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                                    : col.id === "review"
                                                    ? "bg-amber-400"
                                                    : "bg-emerald-400"
                                            }`}
                                        />
                                        <h3 className="font-semibold text-sm text-zinc-100">{col.title}</h3>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                        {col.description}
                                    </p>
                                </div>
                                <Badge variant="secondary" className={`${col.badgeColor} text-xs font-mono px-2 py-0.5 border-0`}>
                                    {columnTasks.length}
                                </Badge>
                            </div>

                            {/* Drop Zone Area */}
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    if (dragOverCol !== col.id) setDragOverCol(col.id)
                                }}
                                onDragLeave={() => {
                                    setDragOverCol(null)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    setDragOverCol(null)
                                    const taskId = e.dataTransfer.getData("text/plain")
                                    if (taskId) {
                                        handleMoveTask(taskId, col.id)
                                    }
                                }}
                                className="flex-1 p-3 overflow-hidden flex flex-col"
                            >
                                <ScrollArea className="flex-1 pr-1">
                                    <div className="space-y-3 min-h-[300px]">
                                        {columnTasks.map((task: KanbanTask) => (
                                            <WorkflowCard
                                                key={task.id}
                                                task={task}
                                                isExecuting={executingTaskIds.has(task.id)}
                                                onMove={handleMoveTask}
                                                onDelete={handleDeleteTask}
                                                onInspect={(t) => setInspectTask(t)}
                                            />
                                        ))}

                                        {/* Empty Column Placeholder */}
                                        {columnTasks.length === 0 && (
                                            <div className="h-40 rounded-lg border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600 text-xs gap-1.5 p-4 text-center">
                                                <Cpu className="h-5 w-5 opacity-40" />
                                                <span>No directives in {col.title}</span>
                                                <span className="text-[10px] text-zinc-700">Drag items here to transition</span>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Global Empty State (If Zero Tasks Across Board) */}
            {tasks.length === 0 && (
                <div className="fixed inset-0 top-32 flex items-center justify-center pointer-events-none">
                    <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-8 max-w-md text-center backdrop-blur-xl shadow-2xl pointer-events-auto">
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-fit mx-auto mb-4">
                            <Sparkles className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Active Directives Found</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            Your operational matrix is idle. Initialize a directive to trigger your autonomous AI workforce.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/20"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Initialize First Directive
                        </Button>
                    </div>
                </div>
            )}

            {/* DIALOG 1: CREATE DIRECTIVE */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Bot className="h-5 w-5 text-cyan-400" />
                            Initialize Agent Directive
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs">
                            Define the parameters and execution prompts for autonomous processing via the Neural Gateway.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateTask} className="space-y-4 py-2">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-zinc-300">
                                Directive Title <span className="text-cyan-400">*</span>
                            </label>
                            <Input
                                placeholder="e.g. Scrape Top 3 Competitor Pricing Tiers"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="bg-black/40 border-white/10 text-sm focus-visible:ring-cyan-500"
                                required
                            />
                        </div>

                        {/* Agent Specialist Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-zinc-300">
                                Assigned Agent Specialist
                            </label>
                            <Select value={formAgentType} onValueChange={setFormAgentType}>
                                <SelectTrigger className="bg-black/40 border-white/10 text-sm">
                                    <SelectValue placeholder="Select Agent Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                    {AGENT_TYPES.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                            <div className="flex items-center justify-between w-full gap-4">
                                                <span>{agent.name}</span>
                                                <span className="text-xs font-mono text-cyan-400">
                                                    ({agent.cost} Credits)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-zinc-500">
                                {AGENT_TYPES.find((a) => a.id === formAgentType)?.desc}
                            </p>
                        </div>

                        {/* Intent */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-zinc-300">
                                Execution Intent
                            </label>
                            <Input
                                placeholder="e.g. Price extraction and positioning synthesis"
                                value={formIntent}
                                onChange={(e) => setFormIntent(e.target.value)}
                                className="bg-black/40 border-white/10 text-sm focus-visible:ring-cyan-500"
                            />
                        </div>

                        {/* Prompt Payload */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase text-zinc-300">
                                    Agent Prompt Payload / Instructions
                                </label>
                                <span className="text-[10px] text-zinc-500 font-mono">Passed to LLM</span>
                            </div>
                            <Textarea
                                placeholder="Specify exact objectives, requirements, target URLs, or output formatting constraints..."
                                value={formPrompt}
                                onChange={(e) => setFormPrompt(e.target.value)}
                                rows={3}
                                className="bg-black/40 border-white/10 text-sm focus-visible:ring-cyan-500 resize-none"
                            />
                        </div>

                        {/* Notes / Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-zinc-300">
                                Directive Context / Description
                            </label>
                            <Input
                                placeholder="Internal context or workflow notes"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                className="bg-black/40 border-white/10 text-sm focus-visible:ring-cyan-500"
                            />
                        </div>

                        {/* Credit Cost Indicator */}
                        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-zinc-300">
                                <Coins className="h-4 w-4 text-amber-400" />
                                <span>Atomic Ledger Cost:</span>
                            </div>
                            <span className="font-mono text-cyan-400 font-semibold text-sm">
                                {formCost} Credit{formCost > 1 ? "s" : ""}
                            </span>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="border-white/10 hover:bg-white/5 text-zinc-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Provisioning...
                                    </>
                                ) : (
                                    "Save to Matrix"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DIALOG 2: INSPECT TASK & AGENT TELEMETRY */}
            <Dialog open={!!inspectTask} onOpenChange={(open) => !open && setInspectTask(null)}>
                <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase">
                                {inspectTask?.agent_type}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/5 text-zinc-300 font-mono text-[10px]">
                                {inspectTask?.credits_cost} Credits
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={`text-[10px] font-mono uppercase ${
                                    inspectTask?.status === "completed"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : inspectTask?.status === "in_progress"
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : inspectTask?.status === "failed"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-zinc-500/20 text-zinc-300"
                                }`}
                            >
                                {inspectTask?.status}
                            </Badge>
                        </div>
                        <DialogTitle className="text-xl text-white">{inspectTask?.title}</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs font-mono">
                            Directive ID: {inspectTask?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {inspectTask && (
                        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
                            {/* Intent & Instructions */}
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                                <div className="text-xs font-mono text-zinc-400 uppercase">Directive Instructions</div>
                                <p className="text-sm text-zinc-200">
                                    {inspectTask.prompt_payload || inspectTask.description || "No custom prompt payload specified."}
                                </p>
                            </div>

                            {/* Telemetry / Description / Output */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-zinc-400 uppercase">
                                        Execution Telemetry & Output
                                    </span>
                                    {inspectTask.description && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopyOutput(inspectTask.description || "")}
                                            className="h-6 text-xs text-zinc-400 hover:text-white"
                                        >
                                            {copiedOutput ? (
                                                <>
                                                    <Check className="h-3 w-3 mr-1 text-emerald-400" /> Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3 mr-1" /> Copy Output
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-white/5 font-mono text-xs text-zinc-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                                    {inspectTask.description || "No execution output recorded yet. Move directive to 'Agent Execution' to trigger."}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="border-t border-white/5 pt-3 flex items-center justify-between sm:justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={() => setInspectTask(null)}
                            className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs"
                        >
                            Close
                        </Button>

                        <div className="flex items-center gap-2">
                            {inspectTask?.status === "todo" && (
                                <Button
                                    onClick={() => {
                                        const t = inspectTask
                                        setInspectTask(null)
                                        handleMoveTask(t.id, "in_progress")
                                    }}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold"
                                >
                                    <Play className="h-3.5 w-3.5 mr-1.5 fill-black" /> Deploy Agent
                                </Button>
                            )}

                            {inspectTask?.status === "review" && (
                                <Button
                                    onClick={() => {
                                        const t = inspectTask
                                        setInspectTask(null)
                                        handleMoveTask(t.id, "completed")
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve & Complete
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
