import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SourcingEngine } from "@/lib/ai/sourcing-engine"
import type { SourcedProduct } from "@/lib/ai/sourcing-engine"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ExternalLink, Loader2, RefreshCw, ShoppingCart, TrendingUp } from "lucide-react"

interface StepSourcingProps {
    data: any
    onComplete: (products: SourcedProduct[]) => void
}

export function StepSourcing({ data, onComplete }: StepSourcingProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState<SourcedProduct[]>([])
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]) // Indices
    const [status, setStatus] = useState("Connecting to Global Supply Chain...")

    useEffect(() => {
        const fetchProducts = async () => {
            const engine = new SourcingEngine()

            // Simulation of multi-step agent actions
            setTimeout(() => setStatus("Scanning CJ Dropshipping Catalog..."), 1500)
            setTimeout(() => setStatus("Analyzing Profit Margins..."), 3000)
            setTimeout(() => setStatus("Verifying Supplier Reliability..."), 4500)

            try {
                // Determine budget from the slider (it's an array)
                const budget = data.budget ? data.budget[0] : 500
                const results = await engine.findWinningProducts(data.niche, budget)
                setProducts(results)
                // Auto-select all by default
                setSelectedProducts(results.map((_, i) => i))
            } catch (error) {
                console.error("Sourcing failed:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [data.niche, data.budget])

    const toggleProduct = (index: number) => {
        if (selectedProducts.includes(index)) {
            setSelectedProducts(prev => prev.filter(i => i !== index))
        } else {
            setSelectedProducts(prev => [...prev, index])
        }
    }

    const handleContinue = () => {
        // Filter only selected products
        const finalSelection = products.filter((_, i) => selectedProducts.includes(i))
        onComplete(finalSelection)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] space-y-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="h-16 w-16 animate-spin text-emerald-400 relative z-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        AI Agent Active
                    </h3>
                    <p className="text-muted-foreground font-mono text-sm animate-pulse">
                        {status}
                    </p>
                </div>
                {/* Visual log simulation could go here */}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-5xl mx-auto"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Winning Products Found</h2>
                    <p className="text-muted-foreground">
                        AI has identified {products.length} high-potential products for your <strong>{data.niche}</strong> store.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    <RefreshCw className="h-3 w-3" />
                    Live Data from CJ / AliExpress
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => {
                    const isSelected = selectedProducts.includes(index)
                    const profit = (product.suggestedPrice - product.cost).toFixed(2)

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`group relative overflow-hidden transition-all duration-300 cursor-pointer border-2 ${isSelected ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-black/20 hover:border-white/10'}`}
                                onClick={() => toggleProduct(index)}
                            >
                                <div className="aspect-video relative overflow-hidden bg-white/5">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-emerald-500 text-black p-1 rounded-full shadow-lg">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-mono border border-white/10">
                                        Source: {product.supplierName}
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-white/5 p-2 rounded">
                                            <div className="text-muted-foreground">Cost</div>
                                            <div className="font-mono">${product.cost.toFixed(2)}</div>
                                        </div>
                                        <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                            <div className="text-emerald-400">Profit</div>
                                            <div className="font-mono font-bold text-emerald-400">${profit}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <TrendingUp className="h-3 w-3" />
                                            <span>High Demand</span>
                                        </div>
                                        {product.supplierUrl && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" asChild onClick={(e) => e.stopPropagation()}>
                                                <a href={product.supplierUrl} target="_blank" rel="noopener noreferrer">
                                                    View Supplier <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
                <Button
                    onClick={handleContinue}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold gap-2 px-8"
                    disabled={selectedProducts.length === 0}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Add {selectedProducts.length} Products & Build Store
                </Button>
            </div>
        </motion.div>
    )
}
