import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Play, 
    MoreVertical, 
    Clock, 
    Coins, 
    Bot, 
    Loader2, 
    CheckCircle2, 
    AlertTriangle,
    Eye,
    Trash2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type KanbanTaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'failed'

export interface KanbanTask {
    id: string
    business_id: string
    title: string
    description: string | null
    status: KanbanTaskStatus
    agent_type: string
    intent: string | null
    prompt_payload: string | null
    credits_cost: number
    created_at: string
    updated_at: string
}

interface WorkflowCardProps {
    task: KanbanTask
    isExecuting: boolean
    onMove: (taskId: string, toStatus: KanbanTaskStatus) => void
    onDelete: (taskId: string) => void
    onInspect: (task: KanbanTask) => void
}

export function WorkflowCard({ task, isExecuting, onMove, onDelete, onInspect }: WorkflowCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Agent badge color theme
    const getAgentBadgeStyle = (agentType: string) => {
        switch (agentType) {
            case 'spy_node':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            case 'market_analyst':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'content_creator':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            case 'seo_optimizer':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            default:
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }
    }

    const formattedDate = () => {
        try {
            const date = new Date(task.created_at)
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        } catch {
            return 'Recent'
        }
    }

    return (
        <>
            <motion.div
                layoutId={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", task.id)
                        e.dataTransfer.effectAllowed = "move"
                    }}
                    className="group cursor-grab active:cursor-grabbing select-none h-full"
                >
                <Card className={`border transition-all duration-200 bg-zinc-950/60 backdrop-blur-sm ${
                    isExecuting 
                        ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/40 animate-pulse'
                        : task.status === 'failed'
                        ? 'border-red-500/40 hover:border-red-500/60 bg-red-950/10'
                        : task.status === 'completed'
                        ? 'border-emerald-500/20 hover:border-emerald-500/40'
                        : 'border-white/5 hover:border-white/20'
                }`}>
                    <CardContent className="p-4 space-y-3">
                        {/* Header & Agent Badge */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <Badge 
                                    variant="outline" 
                                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border ${getAgentBadgeStyle(task.agent_type)}`}
                                >
                                    <Bot className="h-2.5 w-2.5 mr-1" />
                                    {task.agent_type.replace('_', ' ')}
                                </Badge>
                                
                                <Badge variant="secondary" className="text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/5 px-1.5 py-0.5">
                                    <Coins className="h-2.5 w-2.5 mr-1 text-amber-400" />
                                    {task.credits_cost}
                                </Badge>

                                {task.status === 'failed' && (
                                    <Badge variant="destructive" className="text-[10px] font-mono px-1.5 py-0.5">
                                        <AlertTriangle className="h-2.5 w-2.5 mr-1" /> Failed
                                    </Badge>
                                )}
                            </div>

                            {/* Dropdown Options */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white hover:bg-white/10"
                                    >
                                        <MoreVertical className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-xs">
                                    <DropdownMenuLabel className="text-zinc-400 font-mono text-[10px] uppercase">
                                        Directives Control
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onInspect(task)}>
                                        <Eye className="h-3.5 w-3.5 mr-2 text-cyan-400" /> Inspect & Payload
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem 
                                        disabled={task.status === 'todo' || isExecuting}
                                        onClick={() => onMove(task.id, 'todo')}
                                    >
                                        Move to Queue (To-Do)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        disabled={task.status === 'in_progress' || isExecuting}
                                        onClick={() => onMove(task.id, 'in_progress')}
                                    >
                                        Deploy Agent (In Progress)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        disabled={task.status === 'review' || isExecuting}
                                        onClick={() => onMove(task.id, 'review')}
                                    >
                                        Move to Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        disabled={task.status === 'completed' || isExecuting}
                                        onClick={() => onMove(task.id, 'completed')}
                                    >
                                        Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem 
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Task
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Title & Preview */}
                        <div>
                            <h4 
                                onClick={() => onInspect(task)}
                                className="font-semibold text-sm leading-tight text-zinc-100 hover:text-cyan-400 transition-colors cursor-pointer"
                            >
                                {task.title}
                            </h4>
                            {task.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                                    {task.description}
                                </p>
                            )}
                        </div>

                        {/* Executing Telemetry Indicator */}
                        {isExecuting && (
                            <div className="flex items-center gap-2 p-2 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                                <span className="animate-pulse">Processing Agent Gateway...</span>
                            </div>
                        )}

                        {/* Meta & Execution Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                                <Clock className="h-3 w-3" />
                                <span>{formattedDate()}</span>
                            </div>

                            {/* Dynamic Action Button */}
                            <div>
                                {task.status === 'todo' && !isExecuting && (
                                    <Button 
                                        size="sm" 
                                        onClick={() => onMove(task.id, 'in_progress')}
                                        className="h-7 text-xs bg-cyan-500 hover:bg-cyan-400 text-black font-medium shadow-md shadow-cyan-500/20"
                                    >
                                        <Play className="h-3 w-3 mr-1 fill-black" /> Deploy
                                    </Button>
                                )}

                                {task.status === 'in_progress' && (
                                    <Button 
                                        size="sm" 
                                        disabled
                                        className="h-7 text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    >
                                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> In Flight
                                    </Button>
                                )}

                                {task.status === 'review' && (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => onInspect(task)}
                                        className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                    >
                                        <Eye className="h-3 w-3 mr-1" /> Review
                                    </Button>
                                )}

                                {task.status === 'completed' && (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => onInspect(task)}
                                        className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> View Output
                                    </Button>
                                )}

                                {task.status === 'failed' && (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => onMove(task.id, 'in_progress')}
                                        className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                                    >
                                        <Play className="h-3 w-3 mr-1" /> Retry
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </motion.div>

            {/* Confirm Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Directive?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            This will permanently remove "{task.title}" and all associated agent telemetry from the matrix.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => {
                                onDelete(task.id)
                                setIsDeleteDialogOpen(false)
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white"
                        >
                            Delete Directive
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
