import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Box, Upload, Palette, Search, Loader2, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useBusiness } from "@/contexts/BusinessContext"
import { supabase } from "@/lib/supabase"

interface Product {
    id: string
    title: string
    images: string[]
    selling_price: number
}

interface AssetLibraryProps {
    onSelectAsset: (asset: any) => void
    businessId?: string
}

export function AssetLibrary({ onSelectAsset, businessId }: AssetLibraryProps) {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { businesses } = useBusiness()

    // Use first business if no businessId provided
    const activeBusinessId = businessId || businesses[0]?.id

    useEffect(() => {
        if (activeBusinessId) {
            loadProducts()
        } else {
            setIsLoading(false)
        }
    }, [activeBusinessId])

    const loadProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, title, images, selling_price')
                .eq('business_id', activeBusinessId)
                .limit(20)

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Failed to load products:', error)
            setProducts([])
        } finally {
            setIsLoading(false)
        }
    }

    // Filter products by search
    const filteredProducts = products.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full border-r border-white/10 bg-black/40 w-full">
            <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Assets</h3>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search assets..."
                        className="pl-8 bg-white/5 border-white/10 h-8 text-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="products" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 pt-2">
                    <TabsList className="w-full grid grid-cols-3 bg-white/5 h-8">
                        <TabsTrigger value="products" className="text-xs">Items</TabsTrigger>
                        <TabsTrigger value="brand" className="text-xs">Brand</TabsTrigger>
                        <TabsTrigger value="uploads" className="text-xs">Media</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="products" className="flex-1 min-h-0">
                    <ScrollArea className="h-full p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground">
                                    {products.length === 0 ? "No products yet" : "No matching products"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group aspect-square rounded-md bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all relative"
                                        onClick={() => onSelectAsset({
                                            type: 'product',
                                            id: product.id,
                                            url: product.images?.[0] || '/placeholder-product.jpg',
                                            title: product.title,
                                            price: product.selling_price
                                        })}
                                    >
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 group-hover:text-muted-foreground/50">
                                                <Box className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 truncate text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            {product.title || "Untitled"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="brand" className="flex-1 min-h-0">
                    <ScrollArea className="h-full p-4 space-y-6">
                        {/* Logo Section */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-medium">Logos</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className="aspect-video rounded-md bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary/50"
                                    onClick={() => onSelectAsset({ type: 'logo', variant: 'primary' })}
                                >
                                    <span className="text-xs font-bold tracking-widest">LOGO</span>
                                </div>
                                <div
                                    className="aspect-video rounded-md bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary/50"
                                    onClick={() => onSelectAsset({ type: 'logo', variant: 'icon' })}
                                >
                                    <span className="text-xs font-bold tracking-widest text-white">ICON</span>
                                </div>
                            </div>
                        </div>

                        {/* Colors Section */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-medium">Brand Colors</label>
                            <div className="flex flex-wrap gap-2">
                                {['#3b82f6', '#000000', '#ffffff', '#10b981', '#8b5cf6'].map((color) => (
                                    <div
                                        key={color}
                                        className="h-8 w-8 rounded-full border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => onSelectAsset({ type: 'color', value: color })}
                                    />
                                ))}
                                <div className="h-8 w-8 rounded-full border border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-primary">
                                    <Palette className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="uploads" className="flex-1 min-h-0">
                    <div className="p-4 h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">Upload Media</p>
                            <p className="text-xs">Drag & drop or click to browse</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">Choose File</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

