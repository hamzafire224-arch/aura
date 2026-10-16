import { StrategistAgent } from "./strategist"
import { DesignerAgent } from "./designer"
import { generateImage } from "@/lib/ai/providers"

export interface GenesisResult {
    strategy: any
    brand: any
    logoUrl: string
}

export class GenesisEngine {
    private strategist = new StrategistAgent()
    private designer = new DesignerAgent()

    async ignite(userIdea: string, onProgress: (stage: string) => void): Promise<GenesisResult> {

        onProgress("SCANNING_MARKET")
        const strategy = await this.strategist.analyze(userIdea)

        onProgress("SYNTHESIZING_DNA")
        const brand = await this.designer.createIdentity(userIdea, strategy)

        onProgress("FORGING_ASSETS")
        // Generate Logo Real-time
        const logoUrl = await generateImage(brand.logoPrompt)

        return {
            strategy,
            brand,
            logoUrl
        }
    }
}
