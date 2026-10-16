import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { StoreLayoutProps } from "../types"

export function EditorialLayout({ business, products, theme, onBuy }: StoreLayoutProps) {
    const { colors, typography, content } = theme

    return (
        <div className="min-h-screen font-serif" style={{ backgroundColor: colors.background, color: colors.text }}>

            {/* Elegant Header */}
            <nav className="px-8 py-8 flex items-center justify-between">
                <span className="text-xs tracking-[0.2em] uppercase font-sans opacity-50">Est. 2024</span>
                <div className="text-4xl italic font-medium" style={{ fontFamily: typography.headings }}>
                    {business.name}
                </div>
                <button className="text-xs tracking-[0.2em] uppercase font-sans hover:underline">
                    Menu
                </button>
            </nav>

            {/* Asymmetrical Hero */}
            <section className="px-6 py-12 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Text Block */}
                    <div className="col-span-12 md:col-span-4 mt-20 md:sticky top-20">
                        <h1 className="text-5xl md:text-6xl font-normal leading-tight mb-8" style={{ fontFamily: typography.headings }}>
                            {content.heroHeadline}
                        </h1>
                        <p className="text-lg font-sans leading-relaxed opacity-70 mb-10 max-w-xs">
                            {content.heroSubhead}
                        </p>
                        <Button
                            variant="link"
                            className="text-xl p-0 h-auto font-normal italic hover:no-underline group"
                            style={{ color: colors.primary }}
                            onClick={() => products[0] && onBuy(products[0])}
                        >
                            Explore Collection <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Image Gallery */}
                    <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4">
                        <div className="col-span-2 aspect-[16/9] overflow-hidden">
                            <img
                                src={products[0]?.images?.[0] || products[0]?.imageUrl}
                                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                                alt="Hero"
                            />
                        </div>
                        <div className="col-span-1 aspect-[3/4] overflow-hidden mt-12">
                            <img
                                src={products[1]?.images?.[0] || products[1]?.imageUrl || products[0]?.images?.[0]}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                                alt="Secondary"
                            />
                        </div>
                        <div className="col-span-1 aspect-[3/4] overflow-hidden">
                            <div className="h-full w-full bg-neutral-100 flex items-center justify-center p-8 text-center text-sm font-sans uppercase tracking-widest leading-loose">
                                {content.trustBadge} <br />
                                Curated <br />
                                Sustainable <br />
                                Art
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Feed */}
            <section className="py-32 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
                    {products.map((product, i) => (
                        <div key={i} className="group cursor-pointer" onClick={() => onBuy(product)}>
                            <div className="mb-4 overflow-hidden">
                                <img
                                    src={product.images?.[0] || product.imageUrl}
                                    className="aspect-[4/5] object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                    alt={product.title}
                                />
                            </div>
                            <div className="flex justify-between items-baseline border-b border-black/10 pb-4 group-hover:border-black/50 transition-colors">
                                <h3 className="text-xl italic font-medium">{product.title}</h3>
                                <span className="font-sans text-sm">${product.selling_price}</span>
                            </div>
                            <p className="mt-2 text-sm font-sans opacity-60 line-clamp-2">{product.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Manifesto */}
            <section className="py-32 px-6 bg-stone-100 text-center" style={{ backgroundColor: colors.secondary }}>
                <div className="max-w-2xl mx-auto space-y-8">
                    <span className="text-xs uppercase tracking-widest font-sans opacity-50">• Since 2024 •</span>
                    <h2 className="text-3xl md:text-5xl leading-tight" style={{ fontFamily: typography.headings }}>
                        "{content.aboutText}"
                    </h2>
                    <div className="pt-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" className="h-12 opacity-40 mx-auto" alt="Signature" />
                    </div>
                </div>
            </section>
        </div>
    )
}
