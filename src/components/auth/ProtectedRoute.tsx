import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                        <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold tracking-wider text-white">
                            AURA CORE
                        </p>
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                            Authenticating Neural Link...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        // Redirect to /login preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}
