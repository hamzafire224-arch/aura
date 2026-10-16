import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { type MouseEvent } from "react"

export function DeepSpaceBackground({ children }: { children: React.ReactNode }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <div
            className="relative min-h-[calc(100vh-4rem)] bg-[#0B0E14] overflow-hidden group"
            onMouseMove={handleMouseMove}
        >
            {/* 1. Noise Texture Overlay */}
            <div className="absolute inset-0 z-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay"></div>

            {/* 2. Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(124, 58, 237, 0.08),
                            transparent 80%
                        )
                    `
                }}
            />

            {/* 3. Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </div>
    )
}
