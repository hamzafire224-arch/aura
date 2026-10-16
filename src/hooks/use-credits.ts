import { useParams } from "react-router-dom"
import { useBusiness } from "@/contexts/BusinessContext"
import { toast } from "sonner"
import { CREDIT_COSTS } from "@/lib/ai/providers"

export function useCredits() {
    const { id } = useParams()
    const { businesses, deductCredits: executeDeduction } = useBusiness()
    const business = businesses.find(b => b.id === id)

    /**
     * Checks if the business has enough credits for the operation.
     * Displays a toast error if insufficient.
     */
    const checkCredits = (cost: number): boolean => {
        if (!business) return false

        if (business.credits_balance < cost) {
            toast.error(`Insufficient credits. Required: ${cost}, Available: ${business.credits_balance}`, {
                action: {
                    label: "Upgrade",
                    onClick: () => window.location.href = "/dashboard/settings"
                }
            })
            return false
        }
        return true
    }

    /**
     * Deducts credits from the business.
     * Should be called after the operation is successful.
     */
    const spendCredits = async (cost: number): Promise<boolean> => {
        if (!id) return false
        return await executeDeduction(id, cost)
    }

    return {
        checkCredits,
        spendCredits,
        business,
        CREDIT_COSTS // Re-export for convenience
    }
}
