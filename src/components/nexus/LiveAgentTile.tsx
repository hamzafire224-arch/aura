import { useSocket } from "@/lib/hooks/useSocket";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LiveAgentTile = () => {
    const { messages, isConnected } = useSocket();

    // Get last 3 agent messages
    const recentLogs = messages.filter(m => m.role === 'agent').slice(-4);

    return (
        <div className="flex flex-col h-full w-full bg-slate-950/50 rounded-lg overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Neural Uplink</span>
                </div>
                {isConnected && <Activity className="w-3 h-3 text-green-500" />}
            </div>

            {/* Live Feed Visualization */}
            <div className="flex-1 p-4 relative font-mono text-xs">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />

                <div className="space-y-3">
                    <AnimatePresence>
                        {recentLogs.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-2"
                            >
                                <span className="text-primary opacity-50">[{msg.timestamp}]</span>
                                <span className="text-white/80">
                                    <span className="font-bold text-primary">{msg.agentName}:</span> {msg.content}
                                </span>
                            </motion.div>
                        ))}
                        {recentLogs.length === 0 && (
                            <div className="text-muted-foreground italic opacity-50">. . . Awaiting Signal . . .</div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </div>
    );
};
