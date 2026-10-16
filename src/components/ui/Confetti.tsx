import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function SuccessConfetti({ trigger }: { trigger: boolean }) {
    useEffect(() => {
        if (trigger) {
            const duration = 3000
            const end = Date.now() + duration
            const colors = ['#667eea', '#764ba2', '#00e5a0']

                ; (function frame() {
                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors
                    })

                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors
                    })

                    if (Date.now() < end) {
                        requestAnimationFrame(frame)
                    }
                })()
        }
    }, [trigger])

    return null
}
