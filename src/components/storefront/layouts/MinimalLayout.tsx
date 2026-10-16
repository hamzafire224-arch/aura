import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, ArrowRight } from "lucide-react"
import type { StoreLayoutProps } from "../types"

export function MinimalLayout({ business, products, theme, onBuy }: StoreLayoutProps) {
    const { colors, typography, content } = theme

    return (
        <div className="min-h-screen font-sans selection:bg-black selection:text-white" style={{ backgroundColor: colors.background, color: colors.text }}>

            {/* Navbar - Centered & Clean */}
            <nav className="sticky top-0 w-full px-6 py-6 flex items-center justify-between z-40 bg-opacity-90 backdrop-blur-sm" style={{ backgroundColor: colors.background }}>
                <div className="flex-1 md:flex gap-8 text-sm font-medium opacity-60 hidden">
                    <a href="#" className="hover:opacity-100 transition-opacity">Shop</a>
                    <a href="#" className="hover:opacity-100 transition-opacity">About</a>
                </div>

                <div className="text-2xl font-bold tracking-tighter text-center flex-1" style={{ fontFamily: typography.headings }}>
                    {business.name}
                </div>

                <div className="flex items-center justify-end gap-6 flex-1">
                    <a href="#" className="text-sm font-medium opacity-60 hover:opacity-100 hidden md:block">Account</a>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 opacity-80" />
                        <span className="text-xs font-mono hidden md:block">(0)</span>
                    </div>
                    <Menu className="h-5 w-5 md:hidden" />
                </div>
            </nav>

            {/* Hero - Split with massive white space */}
            <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 order-2 md:order-1 space-y-8 text-center md:text-left">
                        <span className="inline-block px-3 py-1 border border-current rounded-full text-xs font-mono uppercase tracking-widest opacity-60">
                            {content.trustBadge}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9]" style={{ fontFamily: typography.headings }}>
                            {content.heroHeadline}
                        </h1>
                        <p className="text-lg opacity-70 max-w-md mx-auto md:mx-0 leading-relaxed font-light">
                            {content.heroSubhead}
                        </p>
                        <Button
                            className="rounded-full px-10 h-14 text-base font-medium transition-transform hover:scale-105"
                            style={{ backgroundColor: colors.primary, color: colors.background === '#ffffff' ? 'white' : 'black' }}
                            onClick={() => products[0] && onBuy(products[0])}
                        >
                            {content.ctaText}
                        </Button>
                    </div>

                    <div className="md:col-span-1" /> {/* Spacer */}

                    <div className="md:col-span-6 order-1 md:order-2">
                        <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-black/5">
                            <img
                                src={products[0]?.images?.[0] || products[0]?.imageUrl}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-[1.5s]"
                                alt="Hero"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid - Simple Cards */}
            <section className="py-24 px-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-light" style={{ fontFamily: typography.headings }}>Essential Collection</h2>
                        <div className="w-12 h-px bg-current mx-auto opacity-20" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product, i) => (
                            <div key={i} className="group cursor-pointer space-y-4" onClick={() => onBuy(product)}>
                                <div className="aspect-[3/4] bg-neutral-100 overflow-hidden rounded-lg relative">
                                    <img
                                        src={product.images?.[0] || product.imageUrl}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                                        alt={product.title}
                                    />
                                    <div className="absolute bottom-4 right-4 h-10 w-10 bg-white rounded-full shadow-xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="font-medium text-lg">{product.title}</h3>
                                    <p className="text-sm opacity-50 font-mono">${product.selling_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story with Overlapping Image */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto relative bg-neutral-50 rounded-3xl p-12 md:p-24" style={{ backgroundColor: colors.secondary }}>
                    <div className="relative z-10 max-w-xl space-y-8">
                        <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: typography.headings, color: colors.primary }}>
                            {content.aboutTitle}
                        </h2>
                        <p className="text-xl leading-relaxed opacity-80">
                            {content.aboutText}
                        </p>
                        <a href="#" className="inline-flex items-center gap-2 border-b border-current pb-1 font-medium hover:opacity-50 transition-opacity">
                            Read Full Story <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    {/* Decorative Circle */}
                    <div
                        className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
                        style={{ backgroundColor: colors.accent }}
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-black/5 text-center text-sm opacity-40 font-mono">
                <p>© {new Date().getFullYear()} {business.name}.</p>
            </footer>
        </div>
    )
}
