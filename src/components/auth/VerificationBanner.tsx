import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function VerificationBanner() {
    const { user } = useAuth()
    const [isVisible, setIsVisible] = useState(true)
    const [sending, setSending] = useState(false)

    // If no user or already confirmed, don't show
    if (!user || user.email_confirmed_at || !isVisible) return null

    const handleResend = async () => {
        if (!user?.email) {
            toast.error("No email address found for this user.")
            return
        }

        setSending(true)
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            })
            if (error) throw error
            toast.success("Verification email sent! Check your inbox.")
        } catch (err: any) {
            toast.error(err.message || "Failed to resend email")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 flex items-center justify-between text-sm animate-in slide-in-from-top-2 fade-in">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Please verify your email address ({user.email}) to unlock all features.</span>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    variant="link"
                    className="h-auto p-0 text-orange-600 dark:text-orange-400 hover:text-orange-500 decoration-orange-600/30"
                    onClick={handleResend}
                    disabled={sending}
                >
                    {sending ? "Sending..." : "Resend Verification Email"}
                </Button>
                <button onClick={() => setIsVisible(false)} className="text-orange-600/60 hover:text-orange-600 dark:text-orange-400/60 dark:hover:text-orange-400">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
