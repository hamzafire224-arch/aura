import { BentoGrid, BentoGridItem } from "@/components/nexus/BentoGrid";
import { LiveAgentTile } from "@/components/nexus/LiveAgentTile";
import { AuraScoreTile } from "@/components/nexus/AuraScoreTile";
import { RiskMonitorTile } from "@/components/nexus/RiskMonitorTile";
import { Activity, Globe, Zap, Database } from "lucide-react";

export default function Nexus() {
    return (
        <div className="h-full w-full p-6 pt-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">The Nexus</h1>
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                    Command & Control // v2.0.0-VOID
                </p>
            </div>

            <BentoGrid>
                {/* 1. The Active Workflow (2x2) - Visualizing the "Brain" */}
                <BentoGridItem
                    title="Genesis Architect"
                    description="Neural Link Active. Awaiting Directives."
                    header={<LiveAgentTile />}
                    className="md:col-span-2 md:row-span-2 min-h-[300px]"
                    icon={<Activity className="h-4 w-4 text-neutral-500" />}
                />

                {/* 2. Aura Score (1x1) */}
                <BentoGridItem
                    title="Aura Score"
                    description="Agency Valuation Metric"
                    header={<AuraScoreTile />}
                    className="md:col-span-1 min-h-[150px]"
                    icon={<Zap className="h-4 w-4 text-neutral-500" />}
                />

                {/* 3. Risk Monitor (1x1) */}
                <BentoGridItem
                    title="Sanctum Monitor"
                    description="Compliance & Risk"
                    header={<RiskMonitorTile />}
                    className="md:col-span-1 min-h-[150px]"
                    icon={<Globe className="h-4 w-4 text-neutral-500" />}
                />

                {/* 4. Treasury Placeholder (1x1) */}
                <BentoGridItem
                    title="Revenue Treasury"
                    description="$0.00 (Pending Implementation)"
                    header={<div className="flex-1 w-full bg-slate-900/50 rounded-lg" />}
                    className="md:col-span-1 min-h-[150px]"
                    icon={<Database className="h-4 w-4 text-neutral-500" />}
                />
            </BentoGrid>
        </div>
    );
}
