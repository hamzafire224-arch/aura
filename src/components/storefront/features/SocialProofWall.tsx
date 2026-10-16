import { motion } from "framer-motion"

interface SocialProofWallProps {
    items?: Array<{ name: string, role?: string, text?: string, image?: string }>
    theme?: any
}

export function SocialProofWall({ items, theme }: SocialProofWallProps) {

    const defaultItems = [
        { name: "TechCrunch", type: "logo" },
        { name: "Forbes", type: "logo" },
        { name: "Wired", type: "logo" },
        { name: "Vogue", type: "logo" },
        { name: "GQ", type: "logo" },
        { name: "TechCrunch", type: "logo" },
        { name: "Forbes", type: "logo" },
        { name: "Wired", type: "logo" }
    ]

    const displayItems = items || defaultItems

    return (
        <div className="w-full py-12 overflow-hidden bg-gradient-to-r from-transparent via-gray-50/50 to-transparent">

            <div className="flex relative items-center">
                {/* Fade Edges */}
                <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-16 items-center px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {[...displayItems, ...displayItems].map((item, i) => (
                        <div key={i} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-default">
                            <span
                                className="text-2xl font-bold font-serif tracking-tighter"
                                style={{ color: theme?.colors?.text || '#000' }}
                            >
                                {item.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <p className="text-center text-xs uppercase tracking-widest mt-6 opacity-40">Trusted by Industry Leaders</p>
        </div>
    )
}
