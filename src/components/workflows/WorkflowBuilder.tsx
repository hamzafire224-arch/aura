import { Card } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function WorkflowBuilder() {
    return (
        <Card className="border-dashed border-2 border-muted h-full flex items-center justify-center p-12 bg-muted/50">
            <div className="text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    <Construction className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">Agentic Workflow Engine</h3>
                    <p className="text-muted-foreground max-w-sm">
                        This module is undergoing a structural refactor (Orbit Module 15).
                        <br />
                        Advanced automation capabilities will return in the next update.
                    </p>
                </div>
            </div>
        </Card>
    )
}
