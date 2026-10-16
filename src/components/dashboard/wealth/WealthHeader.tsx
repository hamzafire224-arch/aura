import { TrendingUp, DollarSign, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function WealthHeader() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:border-emerald-500/30 transition-colors"
            >
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Net Worth</p>
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <DollarSign className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-3xl font-bold font-mono">$1,248,950.00</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>+2.4% today</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:border-blue-500/30 transition-colors"
            >
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Portfolio Health</p>
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Activity className="h-4 w-4" />
                    </div>
                </div>
                <div className="text-3xl font-bold font-mono">98/100</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-blue-500">
                    <span>Diversified & Balanced</span>
                </div>
            </motion.div>
        </div>
    )
}
