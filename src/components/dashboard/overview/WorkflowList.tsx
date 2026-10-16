import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Trash2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function WorkflowList({ workflows = [], onDelete }: { workflows: any[], onDelete?: (id: string) => void }) {
    // Audit: Ensure empty state is polished
    if (!workflows || workflows.length === 0) {
        return (
            <Card className="h-full border-dashed border-2 border-white/10 bg-transparent flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <div className="mb-4 p-4 rounded-full bg-white/5">
                    <Clock className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">No Active Operations</h3>
                <p className="max-w-xs text-sm mt-2">
                    Your mission log is empty. Launch a new workflow to begin building.
                </p>
            </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ActivityIcon /> Active Operations
                    <Badge variant="secondary" className="ml-auto">{workflows.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                <AnimatePresence>
                    {workflows.map((workflow, i) => (
                        <motion.div
                            key={workflow.id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold">{workflow.title || "Untitled Workflow"}</h4>
                                    <p className="text-xs text-muted-foreground">Last updated: {workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <Badge variant={workflow.status === 'active' ? 'default' : 'outline'} className={workflow.status === 'active' ? 'bg-emerald-600' : ''}>
                                    {workflow.status || "Paused"}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{workflow.progress ?? 0}%</span>
                                </div>
                                <Progress value={Number(workflow.progress) || 0} className="h-1.5" />
                            </div>

                            <div className="flex gap-2 mt-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" className="w-full bg-white text-black hover:bg-neutral-200">
                                    <Play className="h-3 w-3 mr-2" /> Resume
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-zinc-950 border-white/10">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Abort Mission?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the "{workflow.title}" workflow and all associated data. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete?.(workflow.id)} className="bg-red-600 hover:bg-red-700">
                                                Confirm Deletion
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}

function ActivityIcon() {
    return (
        <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
    )
}
