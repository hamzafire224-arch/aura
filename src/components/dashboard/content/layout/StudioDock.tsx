import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LayoutGrid, MonitorPlay, Zap } from "lucide-react"

export type StudioView = "canvas" | "trend-radar" | "production"

interface StudioDockProps {
    activeView: StudioView
    onChange: (view: StudioView) => void
}

export function StudioDock({ activeView, onChange }: StudioDockProps) {
    const tabs = [
        { id: "trend-radar", label: "Trend Radar", icon: Zap },
        { id: "canvas", label: "Infinite Canvas", icon: LayoutGrid },
        { id: "production", label: "Production", icon: MonitorPlay },
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = activeView === tab.id
                    const Icon = tab.icon

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id as StudioView)}
                            className={cn(
                                "relative px-4 py-3 rounded-xl transition-all duration-300 group flex items-center gap-2",
                                isActive ? "bg-pink-500/10 text-pink-500 shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                            <span className={cn(
                                "text-sm font-medium transition-all duration-300 overflow-hidden",
                                isActive ? "max-w-[100px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2"
                            )}>
                                {tab.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="studioActiveTab"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-tr from-pink-500/10 to-transparent border border-pink-500/20 -z-10"
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
