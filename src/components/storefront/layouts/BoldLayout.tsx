import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { StoreLayoutProps } from "../types"

export function BoldLayout({ business, products, theme, onBuy }: StoreLayoutProps) {
    const { colors, typography, content } = theme

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: colors.background, color: colors.text }}>

            {/* Announcement Bar */}
            <div className="w-full py-2 text-center text-xs font-bold uppercase tracking-widest bg-black text-white" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
                {content.trustBadge} • Free Worldwide Shipping • {content.trustBadge}
            </div>

            {/* Massive Nav */}
            <nav className="border-b-2 border-current px-6 py-6 flex items-center justify-between sticky top-0 bg-inherit z-40">
                <div className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: typography.headings }}>
                    {business.name.substring(0, 12)}
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-none border-2 border-current hover:bg-current hover:text-white transition-colors" size="sm">
                        Cart (0)
                    </Button>
                </div>
            </nav>

            {/* Brutalist Hero */}
            <section className="grid md:grid-cols-2 min-h-[80vh] border-b-2 border-current">
                <div className="flex flex-col justify-center p-8 md:p-16 border-b-2 md:border-b-0 md:border-r-2 border-current relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tight" style={{ fontFamily: typography.headings }}>
                            {content.heroHeadline.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </h1>
                        <p className="text-xl font-medium max-w-md border-l-4 border-current pl-4">
                            {content.heroSubhead}
                        </p>
                        <Button
                            className="rounded-none h-16 px-12 text-lg font-bold border-2 border-current uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            style={{ backgroundColor: colors.accent, color: 'black' }}
                            onClick={() => products[0] && onBuy(products[0])}
                        >
                            {content.ctaText}
                        </Button>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-neutral-100 flex items-center justify-center p-12">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20 mix-blend-multiply" />
                    <img
                        src={products[0]?.images?.[0] || products[0]?.imageUrl}
                        className="w-full max-w-md object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500 hover:rotate-2"
                        alt="Hero"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-8 right-8 h-24 w-24 bg-white rounded-full flex items-center justify-center border-2 border-black animate-spin-slow">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">New<br />Drop</span>
                    </div>
                </div>
            </section>

            {/* Ticker */}
            <div className="overflow-hidden border-b-2 border-current bg-yellow-400 py-3" style={{ backgroundColor: colors.accent }}>
                <div className="wrapper flex whitespace-nowrap">
                    {/* CSS Marquee would go here - simplified for React */}
                    <span className="text-lg font-bold uppercase tracking-widest px-4">
                        LIMITED STOCK • DO NOT SLEEP • {content.trustBadge.toUpperCase()} •
                        LIMITED STOCK • DO NOT SLEEP • {content.trustBadge.toUpperCase()} •
                        LIMITED STOCK • DO NOT SLEEP • {content.trustBadge.toUpperCase()} •
                    </span>
                    <span className="text-lg font-bold uppercase tracking-widest px-4 md:hidden">
                        LIMITED STOCK • DO NOT SLEEP • {content.trustBadge.toUpperCase()} •
                    </span>
                </div>
            </div>

            {/* Product Grid - Grid Lines */}
            <section className="border-b-2 border-current">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, i) => (
                        <div key={i} className="group border-b-2 md:border-b-0 border-current md:border-r-2 last:border-r-0 relative p-8 hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => onBuy(product)}>
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-sm">0{i + 1}</span>
                                <div className="flex gap-1">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                            </div>

                            <div className="aspect-square mb-6 flex items-center justify-center">
                                <img
                                    src={product.images?.[0] || product.imageUrl}
                                    className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300"
                                    alt={product.title}
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase leading-none">{product.title}</h3>
                                <p className="font-mono text-lg">${product.selling_price}</p>
                            </div>

                            <Button className="w-full mt-6 rounded-none border-2 border-current bg-transparent text-current hover:bg-black hover:text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer - Big Typography */}
            <footer className="py-24 px-6 bg-black text-white text-center">
                <h2 className="text-[10vw] font-black leading-none opacity-20 select-none">
                    {business.name.toUpperCase()}
                </h2>
                <p className="mt-8 font-mono text-sm opacity-50">EST. {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}
