import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

interface WelcomeHeaderProps {
    workflowCount: number
    onResume: () => void
    onLaunch: () => void
}

export function WelcomeHeader({ workflowCount, onResume, onLaunch }: WelcomeHeaderProps) {
    const { user } = useAuth()
    const [greeting, setGreeting] = useState("Good Day")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good Morning")
        else if (hour < 18) setGreeting("Good Afternoon")
        else setGreeting("Good Evening")
    }, [])

    const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Captain"

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-blue-900/20 to-background border border-white/10 p-8 shadow-2xl">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        {greeting}, {userName}.
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg">
                        {workflowCount > 0
                            ? "Your empire is active. One mission requires your attention."
                            : "All systems nominal. Ready to launch your next venture?"}
                    </p>
                </div>

                <div className="flex-shrink-0">
                    {workflowCount > 0 ? (
                        <Button
                            size="lg"
                            onClick={onResume}
                            className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            Resume Mission
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={onLaunch}
                            className="group bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/10 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                            Launch New Empire
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
