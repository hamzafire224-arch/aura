import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutGrid, // Nexus
    Zap,        // Workflows
    Target,     // Spy
    Wallet      // Treasury
} from "lucide-react";

const NAV_ITEMS = [
    { id: 'nexus', icon: LayoutGrid, label: 'Nexus', path: '/dashboard' },
    { id: 'workflows', icon: Zap, label: 'Workflows', path: '/dashboard/workflows' },
    { id: 'spy', icon: Target, label: 'Spy', path: '/dashboard/spy' },
    { id: 'treasury', icon: Wallet, label: 'Treasury', path: '/dashboard/treasury' }
];

export const VoidDock = () => {
    const location = useLocation();

    return (
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            {NAV_ITEMS.map((item) => {
                const isActive = item.path === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(item.path);

                return (
                    <Link to={item.path} key={item.id}>
                        <motion.div
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
                                ${isActive ? "bg-white/10 text-primary shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}
                            `}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />

                            {/* Tooltip on Hover */}
                            <span className="sr-only">{item.label}</span>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-dock-pill"
                                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                                />
                            )}
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
};
