import { Button } from "@/components/ui/button"
import { ArrowRight, QrCode } from "lucide-react"
import type { StoreLayoutProps } from "../types"

export function IndustrialLayout({ business, products, theme, onBuy }: StoreLayoutProps) {
    const { colors, typography, content } = theme

    return (
        <div className="min-h-screen font-mono bg-neutral-200 text-black" style={{ backgroundColor: colors.background, color: colors.text }}>

            {/* System Status Bar */}
            <div className="border-b border-black flex justify-between px-4 py-1 text-[10px] uppercase tracking-wider bg-black text-white">
                <span>Sys.Status: Online</span>
                <span>Secure_Connection_Established</span>
                <span>{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Header */}
            <nav className="border-b border-black px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <QrCode className="h-8 w-8" />
                    <div className="leading-none">
                        <div className="text-lg font-bold uppercase">{business.name}</div>
                        <div className="text-[10px] opacity-60">REF: {business.id.substring(0, 8)}</div>
                    </div>
                </div>
                <Button variant="outline" className="items-center border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none h-8 text-xs">
                    Catalog_View
                </Button>
            </nav>

            {/* Grid Layout for Hero */}
            <section className="grid md:grid-cols-12 min-h-[600px] border-b border-black">
                {/* Left: Specs */}
                <div className="md:col-span-4 p-8 border-b md:border-b-0 md:border-r border-black flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="inline-block px-2 py-1 border border-black text-xs font-bold uppercase bg-yellow-400">
                            {content.trustBadge}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none" style={{ fontFamily: typography.headings }}>
                            {content.heroHeadline}
                        </h1>
                        <p className="text-sm opacity-70 leading-relaxed font-sans max-w-xs">
                            {content.heroSubhead}
                        </p>
                    </div>

                    <div className="space-y-4 mt-12">
                        <div className="grid grid-cols-2 gap-px bg-black border border-black">
                            <div className="bg-white p-2 text-xs">TYPE</div>
                            <div className="bg-white p-2 text-xs">COMMERCIAL</div>
                            <div className="bg-white p-2 text-xs">ORIGIN</div>
                            <div className="bg-white p-2 text-xs">GLOBAL</div>
                        </div>
                        <Button
                            className="w-full rounded-none h-12 border border-black bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors uppercase tracking-widest text-xs font-bold"
                            onClick={() => products[0] && onBuy(products[0])}
                        >
                            {content.ctaText} // INITIATE_ORDER
                        </Button>
                    </div>
                </div>

                {/* Right: Technical Diagram / Image */}
                <div className="md:col-span-8 relative bg-[url(/grid.svg)]">
                    <img
                        src={products[0]?.images?.[0] || products[0]?.imageUrl}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
                        alt="Hero"
                        style={{ filter: 'grayscale(100%) contrast(120%)' }}
                    />
                    <div className="absolute inset-0 p-8 border-l border-black/10 pointer-events-none">
                        <div className="border border-black/40 h-full w-full relative">
                            {/* Crosshairs */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-black" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-black" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-black" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-black" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Inventory List */}
            <section className="bg-white">
                <div className="border-b border-black p-2 text-xs font-bold uppercase bg-neutral-100 flex justify-between">
                    <span>Available_Inventory_Units</span>
                    <span>Total: {products.length}</span>
                </div>

                <div className="divide-y divide-black">
                    {products.map((product, i) => (
                        <div key={i} className="grid grid-cols-12 hover:bg-neutral-50 group cursor-pointer transition-colors" onClick={() => onBuy(product)}>
                            <div className="col-span-2 md:col-span-1 border-r border-black p-4 flex items-center justify-center font-bold text-xs bg-neutral-100">
                                {String(i + 1).padStart(3, '0')}
                            </div>
                            <div className="col-span-3 md:col-span-2 border-r border-black p-2">
                                <img src={product.images?.[0] || product.imageUrl} className="h-16 w-16 object-contain mix-blend-multiply grayscale group-hover:grayscale-0" alt="img" />
                            </div>
                            <div className="col-span-7 md:col-span-6 border-r border-black p-4 flex flex-col justify-center">
                                <h3 className="font-bold uppercase text-sm">{product.title}</h3>
                                <span className="text-xs opacity-50 truncate">{product.description}</span>
                            </div>
                            <div className="col-span-12 md:col-span-3 p-4 flex items-center justify-between md:justify-end gap-4 bg-neutral-50 md:bg-transparent border-t border-black md:border-t-0">
                                <span className="font-bold">${product.selling_price}</span>
                                <Button size="sm" variant="outline" className="h-8 rounded-none border-black hover:bg-black hover:text-white uppercase text-[10px]">
                                    Acquire <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
