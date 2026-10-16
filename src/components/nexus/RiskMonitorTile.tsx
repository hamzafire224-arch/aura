import { ShieldCheck } from "lucide-react";

export const RiskMonitorTile = () => {
    return (
        <div className="flex flex-col h-full w-full bg-slate-950/50 rounded-lg p-4 relative overflow-hidden border border-white/5">
            <div className="flex items-center justify-between z-10 relative">
                <span className="text-xs font-mono text-muted-foreground uppercase">Stripe Health</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="flex-1 flex items-center justify-center z-10 relative">
                <div className="text-center">
                    <div className="text-emerald-500 font-bold text-xl tracking-tight">SECURE</div>
                    <div className="text-[10px] text-muted-foreground mt-1">0.0% Dispute Rate</div>
                </div>
            </div>

            {/* Pulse Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        </div>
    );
};
