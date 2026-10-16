import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Hero/Animation */}
            <div className="hidden w-1/2 bg-background lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background" />

                <div className="relative z-10 flex h-full flex-col justify-between p-12">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight leading-none">AURA</span>
                            <span className="text-[0.6rem] font-medium text-muted-foreground tracking-wider uppercase">The Automated Universal Revenue Assistant</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl"
                        >
                            Your AI Co-Founder <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Has Arrived.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg text-muted-foreground max-w-md"
                        >
                            Automate your business operations, marketing, and growth with the world's most advanced revenue assistant.
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>© 2025 AURA Inc.</span>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
