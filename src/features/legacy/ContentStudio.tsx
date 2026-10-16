import { useState } from "react"
import { ProductionBoard } from "@/components/dashboard/content/views/ProductionBoard"
import { CanvasBoard } from "@/components/dashboard/content/views/CanvasBoard"
import { TrendRadar } from "@/components/dashboard/content/views/TrendRadar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, Kanban, Target } from "lucide-react"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function ContentStudio() {
    const [activeTab, setActiveTab] = useState("trend-radar")

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
                    <p className="text-muted-foreground">The Creator's Foundry: From Trend to Production.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card/40 backdrop-blur-md border border-white/5 p-1 h-auto grid grid-cols-3 w-full md:w-auto gap-2">
                    <TabsTrigger value="trend-radar" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2 h-10">
                        <Target className="h-4 w-4" /> Trend Radar
                    </TabsTrigger>
                    <TabsTrigger value="canvas" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2 h-10">
                        <LayoutGrid className="h-4 w-4" /> Infinite Canvas
                    </TabsTrigger>
                    <TabsTrigger value="production" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2 h-10">
                        <Kanban className="h-4 w-4" /> Production Board
                    </TabsTrigger>
                </TabsList>

                <div className="min-h-[600px]">
                    <TabsContent value="trend-radar" className="space-y-6 focus-visible:ring-0 mt-0">
                        <ErrorBoundary>
                            <TrendRadar />
                        </ErrorBoundary>
                    </TabsContent>

                    <TabsContent value="canvas" className="space-y-6 focus-visible:ring-0 mt-0">
                        <ErrorBoundary>
                            <CanvasBoard />
                        </ErrorBoundary>
                    </TabsContent>

                    <TabsContent value="production" className="space-y-6 focus-visible:ring-0 mt-0">
                        <ErrorBoundary>
                            <ProductionBoard />
                        </ErrorBoundary>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
