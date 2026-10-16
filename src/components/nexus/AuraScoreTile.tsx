import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSocket } from "@/lib/hooks/useSocket";

export const AuraScoreTile = () => {
    const { metrics } = useSocket();
    const score = metrics?.aura_score || 0; // Safe access

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950/50 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition duration-500" />

            <motion.div
                key={score} // Re-animate on change
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 flex flex-col items-center"
            >
                <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    {score > 0 ? score : "--"}
                </h3>
                <div className="flex items-center gap-1 text-primary text-xs mt-1 font-mono tracking-widest uppercase">
                    <Sparkles size={12} />
                    <span>{score > 80 ? "Radiant" : score > 50 ? "Stable" : "Analyzing"}</span>
                </div>
            </motion.div>

            {/* Simulated Sparkles */}
            {score > 0 && (
                <>
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-primary rounded-full animate-pulse delay-75" />
                </>
            )}
        </div>
    );
};
