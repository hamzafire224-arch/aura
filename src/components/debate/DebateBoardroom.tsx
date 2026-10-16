import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/lib/hooks/useSocket";
import { AgentAvatar } from "./AgentAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "agent" | "user" | "system";
    agentName?: string;
    content: string;
    timestamp: string;
    verdict?: string;
    decision?: string;
    concept?: string;
}

interface AgentThinkingState {
    Analyst: "idle" | "thinking" | "speaking" | "complete";
    Designer: "idle" | "thinking" | "speaking" | "complete";
    Chief: "idle" | "thinking" | "speaking" | "complete";
}

export const DebateBoardroom = () => {
    const { messages, isConnected, sendMessage, metrics } = useSocket();
    const [input, setInput] = useState("");
    const [isDebating, setIsDebating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [thinkingStates, setThinkingStates] = useState<AgentThinkingState>({
        Analyst: "idle",
        Designer: "idle",
        Chief: "idle"
    });

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Track agent speaking states based on messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "agent" && lastMessage.agentName) {
            const agent = lastMessage.agentName as keyof AgentThinkingState;
            if (thinkingStates[agent] !== undefined) {
                setThinkingStates(prev => ({
                    ...prev,
                    [agent]: "complete"
                }));
            }
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !isConnected) return;

        sendMessage(input);
        setInput("");
        setIsDebating(true);

        // Simulate thinking state progression
        setThinkingStates({ Analyst: "thinking", Designer: "idle", Chief: "idle" });
        setTimeout(() => setThinkingStates(prev => ({ ...prev, Analyst: "speaking", Designer: "thinking" })), 2000);
        setTimeout(() => setThinkingStates(prev => ({ ...prev, Designer: "speaking", Chief: "thinking" })), 4000);
        setTimeout(() => setThinkingStates(prev => ({ ...prev, Chief: "speaking" })), 6000);
    };

    const getRiskBadge = (level: string) => {
        const config = {
            Low: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
            Medium: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle },
            High: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle }
        };
        const { color, icon: Icon } = config[level as keyof typeof config] || config.Medium;

        return (
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1", color)}>
                <Icon className="w-3 h-3" />
                {level} Risk
            </span>
        );
    };

    return (
        <div className="h-full w-full flex flex-col bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <motion.div
                            className="absolute inset-0 bg-primary rounded-full blur-lg opacity-30"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">Executive Boardroom</h1>
                        <p className="text-xs text-muted-foreground">AI Strategic Debate Chamber</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                        <span className="text-xs text-muted-foreground">{isConnected ? "Neural Link Active" : "Connecting..."}</span>
                    </div>
                    {metrics.risk_level !== "Analyzing..." && getRiskBadge(metrics.risk_level)}
                </div>
            </div>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Chat Stream */}
                <div className="flex-1 flex flex-col border-r border-white/10">
                    {/* Agent Status Row */}
                    <div className="flex justify-center gap-8 p-4 border-b border-white/5 bg-slate-900/30">
                        {(["Analyst", "Designer", "Chief"] as const).map((agent) => (
                            <div key={agent} className="flex flex-col items-center gap-2">
                                <AgentAvatar agent={agent} status={thinkingStates[agent]} size="md" />
                                <span className="text-xs text-muted-foreground">{agent}</span>
                            </div>
                        ))}
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === "user" && "justify-end"
                                        )}
                                    >
                                        {msg.role === "agent" && (
                                            <AgentAvatar
                                                agent={(msg as Message).agentName as "Analyst" | "Designer" | "Chief" || "Analyst"}
                                                status="complete"
                                                size="sm"
                                            />
                                        )}

                                        <Card className={cn(
                                            "max-w-[80%] p-3 backdrop-blur-xl",
                                            msg.role === "user"
                                                ? "bg-primary/20 border-primary/30"
                                                : "bg-slate-800/50 border-white/10"
                                        )}>
                                            {msg.role === "agent" && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold text-primary">{(msg as Message).agentName}</span>
                                                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                                </div>
                                            )}
                                            <p className="text-sm text-white/90 whitespace-pre-wrap">{msg.content}</p>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Sparkles className="w-12 h-12 text-primary/30 mb-4" />
                                    <h3 className="text-lg font-medium text-white/70">Ready for Strategic Analysis</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Enter a niche or business idea to begin the AI debate
                                    </p>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-slate-900/30">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter a niche to analyze (e.g., 'Sustainable pet products')"
                                className="flex-1 bg-slate-800/50 border-white/10 focus:border-primary/50"
                                disabled={!isConnected}
                            />
                            <Button type="submit" disabled={!isConnected || !input.trim()}>
                                {isDebating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Panel - Strategy Whiteboard */}
                <div className="w-80 flex flex-col bg-slate-900/30">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Live Strategy Board
                        </h2>
                    </div>

                    <div className="flex-1 p-4 space-y-4">
                        {/* Aura Score */}
                        <Card className="p-4 bg-slate-800/30 border-white/10">
                            <div className="text-xs text-muted-foreground mb-2">Aura Score™</div>
                            <div className="flex items-end gap-2">
                                <span className={cn(
                                    "text-4xl font-bold",
                                    metrics.aura_score >= 70 ? "text-green-400" :
                                        metrics.aura_score >= 40 ? "text-amber-400" : "text-red-400"
                                )}>
                                    {metrics.aura_score}
                                </span>
                                <span className="text-sm text-muted-foreground mb-1">/100</span>
                            </div>
                            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn(
                                        "h-full rounded-full",
                                        metrics.aura_score >= 70 ? "bg-green-500" :
                                            metrics.aura_score >= 40 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metrics.aura_score}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </Card>

                        {/* Quick Insights */}
                        <Card className="p-4 bg-slate-800/30 border-white/10 space-y-3">
                            <div className="text-xs text-muted-foreground">Quick Insights</div>

                            {messages.filter(m => m.role === "agent").slice(-3).map((msg, i) => (
                                <div key={i} className="text-xs">
                                    <span className="text-primary font-medium">{(msg as Message).agentName}: </span>
                                    <span className="text-white/70">{msg.content.slice(0, 80)}...</span>
                                </div>
                            ))}

                            {messages.filter(m => m.role === "agent").length === 0 && (
                                <div className="text-xs text-muted-foreground italic">Awaiting debate start...</div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebateBoardroom;
