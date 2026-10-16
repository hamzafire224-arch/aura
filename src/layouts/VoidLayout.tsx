import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { VoidDock } from "@/components/void/VoidDock";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useBusiness } from "@/contexts/BusinessContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function VoidLayout() {
    const { user: _user } = useAuth();
    const { businesses } = useBusiness();
    // Get subscription status from first business
    const subscription_status = businesses[0]?.subscription_status;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Dunning Logic: The "Grace Period" Warning
        if (subscription_status === 'past_due') {
            toast.error("Payment Failed", {
                description: "We are retrying your payment. Your features remain active (Grace Period).",
                duration: Infinity, // Persistent until fixed
                icon: <AlertCircle className="w-5 h-5 text-red-500" />,
                action: {
                    label: "Fix Payment",
                    onClick: () => navigate("/dashboard/treasury") // Or billing portal
                }
            });
        }
    }, [subscription_status, navigate]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/20 overflow-hidden relative">

            {/* Ambient Aura Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
                {/* Note: noise.png might not exist, but CSS pattern works without it for now or we add one later */}
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 w-full h-[calc(100vh-80px)] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* The Dock Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-10 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <VoidDock />
                </div>
            </div>
        </div>
    );
};
