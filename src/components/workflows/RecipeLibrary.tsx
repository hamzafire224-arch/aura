import { Card } from "@/components/ui/card"
import { Construction } from "lucide-react"

export function RecipeLibrary() {
    return (
        <Card className="border-dashed border-2 border-muted h-full flex items-center justify-center p-12 bg-muted/50">
            <div className="text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    <Construction className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">Strategy Library</h3>
                    <p className="text-muted-foreground max-w-sm">
                        The strategies vault is being upgraded for the new Agentic Core 2.0.
                        <br />
                        Available in the next system update.
                    </p>
                </div>
            </div>
        </Card>
    )
}
