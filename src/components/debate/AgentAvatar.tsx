import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
    agent: "Analyst" | "Designer" | "Chief";
    status: "idle" | "thinking" | "speaking" | "complete";
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Agent color schemes
const agentThemes = {
    Analyst: {
        primary: "#3B82F6", // Blue
        secondary: "#1E40AF",
        gradient: "from-blue-500 to-indigo-600",
        glow: "shadow-blue-500/50",
        shape: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" // Pentagon
    },
    Designer: {
        primary: "#A855F7", // Purple
        secondary: "#7C3AED",
        gradient: "from-purple-500 to-pink-500",
        glow: "shadow-purple-500/50",
        shape: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" // Hexagon
    },
    Chief: {
        primary: "#F59E0B", // Amber
        secondary: "#D97706",
        gradient: "from-amber-400 to-orange-500",
        glow: "shadow-amber-500/50",
        shape: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" // Diamond
    }
};

const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24"
};

export const AgentAvatar = ({ agent, status, size = "md", className }: AgentAvatarProps) => {
    const theme = agentThemes[agent];

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Outer glow ring */}
            <motion.div
                className={cn(
                    "absolute rounded-full blur-xl opacity-40",
                    sizeClasses[size],
                    `bg-gradient-to-r ${theme.gradient}`
                )}
                animate={{
                    scale: status === "thinking" || status === "speaking" ? [1, 1.3, 1] : 1,
                    opacity: status === "idle" ? 0.2 : 0.6
                }}
                transition={{
                    duration: 2,
                    repeat: status === "thinking" || status === "speaking" ? Infinity : 0,
                    ease: "easeInOut"
                }}
            />

            {/* Main geometric shape */}
            <motion.div
                className={cn(
                    "relative flex items-center justify-center",
                    sizeClasses[size],
                    `bg-gradient-to-br ${theme.gradient}`,
                    `shadow-lg ${theme.glow}`
                )}
                style={{ clipPath: theme.shape }}
                animate={{
                    rotate: status === "speaking" ? [0, 5, -5, 0] : 0,
                    scale: status === "thinking" ? [1, 1.05, 1] : 1
                }}
                transition={{
                    duration: status === "speaking" ? 0.5 : 1.5,
                    repeat: status !== "idle" && status !== "complete" ? Infinity : 0,
                    ease: "easeInOut"
                }}
            >
                {/* Inner core */}
                <motion.div
                    className={cn(
                        "absolute inset-1",
                        "bg-slate-900/80 backdrop-blur-sm"
                    )}
                    style={{ clipPath: theme.shape }}
                />

                {/* Center icon/initial */}
                <span className="relative z-10 text-white font-bold text-sm">
                    {agent[0]}
                </span>
            </motion.div>

            {/* Status indicator */}
            <AnimatePresence>
                {status === "thinking" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1 -right-1 flex gap-0.5"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-white"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Complete checkmark */}
            <AnimatePresence>
                {status === "complete" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                    >
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentAvatar;
