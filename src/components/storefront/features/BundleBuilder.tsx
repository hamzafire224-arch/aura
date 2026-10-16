import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAnalytics } from "@/lib/analytics"

interface BundleBuilderProps {
    theme?: any
    onBuy: (product: any) => void
}

export function BundleBuilder({ theme, onBuy }: BundleBuilderProps) {
    const primaryColor = theme?.colors?.primary || '#000'
    const [selected, setSelected] = useState([true, true, false])

    const products = [
        { id: 1, name: "Core Product", price: 49 },
        { id: 2, name: "Accessory Kit", price: 29 },
        { id: 3, name: "Extended Warranty", price: 19 }
    ]

    const toggle = (i: number) => {
        const newSelected = [...selected]
        newSelected[i] = !newSelected[i]
        setSelected(newSelected)
    }

    const total = products.reduce((acc, p, i) => selected[i] ? acc + p.price : acc, 0)
    const discount = total * 0.15 // 15% Bundle Discount
    const finalPrice = total - discount

    const { ref, trackClick } = useAnalytics('BundleBuilder')

    return (
        <div ref={ref} className="w-full max-w-2xl mx-auto py-12 px-4">
            <div className="border rounded-xl p-6 shadow-lg bg-white">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Frequently Bought Together</h3>
                        <p className="text-sm text-muted-foreground">Bundle and save 15% instantly</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 line-through">${total.toFixed(2)}</div>
                        <div className="text-xl font-bold text-emerald-600">${finalPrice.toFixed(2)}</div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {products.map((p, i) => (
                        <div
                            key={i}
                            onClick={() => toggle(i)}
                            className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${selected[i] ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className={`h-5 w-5 rounded border flex items-center justify-center ${selected[i] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                                {selected[i] && <Plus className="h-3 w-3 text-white" />}
                            </div>
                            <div className="h-12 w-12 bg-gray-100 rounded-md" />
                            <div className="flex-1">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-gray-500">${p.price}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    className="w-full h-12 text-lg"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => {
                        trackClick({ value: finalPrice, items: selected })
                        onBuy({ title: "Custom Bundle", selling_price: finalPrice })
                    }}
                >
                    Add Bundle to Cart - Save ${(discount).toFixed(2)}
                </Button>
            </div>
        </div>
    )
}
