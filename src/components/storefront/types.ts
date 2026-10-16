import type { StoreTheme } from "@/lib/ai/store-builder"

export interface StoreLayoutProps {
    business: any
    products: any[]
    theme: StoreTheme
    onBuy: (product: any) => void
}
