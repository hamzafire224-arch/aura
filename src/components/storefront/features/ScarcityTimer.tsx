import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Timer } from "lucide-react"
import { useAnalytics } from "@/lib/analytics"

interface ScarcityTimerProps {
    deadline: Date | string
    headline?: string
    style?: 'sticky' | 'inline'
    theme?: any
}

export function ScarcityTimer({
    deadline,
    headline = "High Demand: Offer ends in",
    style = 'inline',
    theme
}: ScarcityTimerProps) {

    // Default to 15 minutes if date is invalid or past
    const [timeLeft, setTimeLeft] = useState(() => {
        if (!deadline) return 15 * 60
        const diff = Math.floor((new Date(deadline).getTime() - Date.now()) / 1000)
        return diff > 0 ? diff : 0
    })
    const [isUrgent, setIsUrgent] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) return 0
                if (prev < 180) setIsUrgent(true) // Under 3 mins
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    const primaryColor = theme?.colors?.primary || '#000'
    const accentColor = theme?.colors?.accent || '#EF4444'

    const { ref } = useAnalytics('ScarcityTimer')

    if (style === 'sticky') {
        return (
            <AnimatePresence>
                {timeLeft > 0 && (
                    <motion.div
                        ref={ref}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-0 left-0 w-full z-50 p-2"
                    >
                        <div
                            className="max-w-md mx-auto rounded-lg shadow-2xl p-3 flex items-center justify-between backdrop-blur-md"
                            style={{
                                backgroundColor: isUrgent ? accentColor : '#000000DD',
                                color: '#FFF'
                            }}
                        >
                            <span className="text-sm font-medium">{headline}</span>
                            <div className="flex items-center gap-2 font-mono text-xl font-bold">
                                <Timer className="h-5 w-5 animate-pulse" />
                                {displayTime}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }

    return (
        <div
            ref={ref}
            className="w-full p-3 rounded-md border flex items-center justify-center gap-3 mb-6"
            style={{
                borderColor: isUrgent ? accentColor : primaryColor + '40',
                backgroundColor: isUrgent ? accentColor + '10' : primaryColor + '05',
                color: primaryColor
            }}
        >
            <span className="text-sm font-medium uppercase tracking-wide opacity-80">{headline}</span>
            <div
                className={`font-mono text-lg font-bold ${isUrgent ? 'animate-pulse text-red-500' : ''}`}
                style={{ color: isUrgent ? accentColor : primaryColor }}
            >
                {displayTime}
            </div>
        </div>
    )
}
