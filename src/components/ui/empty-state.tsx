import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 border border-dashed border-white/10 rounded-lg bg-white/5 animate-in fade-in zoom-in-95 duration-500">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} size="lg" className="shadow-lg shadow-primary/20">
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
