import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    Store,
    BarChart3,
    GraduationCap,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    Target,
    Sparkles,
    BookOpen,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBusiness } from "@/contexts/BusinessContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEntitlements } from "@/lib/hooks/useEntitlements"

// Tier display names mapping
const TIER_DISPLAY_NAMES: Record<string, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Professional',
    professional: 'Professional',
    agency: 'Agency',
    enterprise: 'Enterprise'
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const { pathname } = useLocation()
    const { stats } = useBusiness()
    const { user, signOut, subscription_tier } = useAuth()
    const { credits, tier } = useEntitlements()

    // Derive user display data from AuthContext (real data, no mocks)
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const userAvatar = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`
    const planDisplayName = TIER_DISPLAY_NAMES[tier] || TIER_DISPLAY_NAMES[subscription_tier] || 'Free'

    // Credits from business stats or entitlements
    const currentCredits = stats?.credits?.value ?? credits
    const totalCredits = stats?.credits?.total ?? 500
    const resetDays = stats?.credits?.resetDays ?? 30
    const creditsPercent = totalCredits > 0 ? (currentCredits / totalCredits) * 100 : 0

    return (
        <div
            id="tour-sidebar"
            className={cn(
                "relative flex flex-col h-screen border-r border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300",
                collapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Logo & Collapse Button */}
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence mode='wait'>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-primary shrink-0 shadow-[0_0_15px_-3px_rgba(51,102,255,0.5)]" />
                            <div className="flex flex-col -space-y-1">
                                <span className="text-xl font-bold tracking-tight">AURA</span>
                                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">increase</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn("h-8 w-8", collapsed ? "mx-auto" : "ml-auto")}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">

                {/* Main Operations */}
                <div className="px-3">
                    {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-4">Operations</p>}
                    <div className="space-y-1">
                        {[
                            { name: 'Dashboard', href: '/dashboard', icon: Home },
                            { name: 'Workflows', href: '/dashboard/workflows', icon: Sparkles },
                            { name: 'My Businesses', href: '/dashboard/businesses', icon: Store },
                        ].map((item) => (
                            <Link key={item.href} to={item.href}>
                                <div className="relative group">
                                    {pathname === item.href && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start relative z-10 hover:bg-transparent h-9",
                                            collapsed ? "px-2 justify-center" : "px-4"
                                        )}
                                        title={collapsed ? item.name : undefined}
                                    >
                                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className={cn("ml-3 truncate overflow-hidden text-sm", pathname === item.href && "font-medium text-primary")}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Growth & Tools */}
                <div className="px-3">
                    {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-4">Growth Engine</p>}
                    <div className="space-y-1">
                        {[
                            { name: 'Genesis Engine', href: '/dashboard/genesis', icon: Zap },
                            { name: 'Competitor Spy', href: '/dashboard/spy', icon: Target },
                            { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
                        ].map((item) => (
                            <Link key={item.href} to={item.href}>
                                <div className="relative group">
                                    {pathname === item.href && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start relative z-10 hover:bg-transparent h-9",
                                            collapsed ? "px-2 justify-center" : "px-4"
                                        )}
                                        title={collapsed ? item.name : undefined}
                                    >
                                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className={cn("ml-3 truncate overflow-hidden text-sm", pathname === item.href && "font-medium text-primary")}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Learning */}
                <div className="px-3">
                    {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-4">Knowledge</p>}
                    <div className="space-y-1">
                        {[
                            { name: 'Training', href: '/dashboard/learning', icon: GraduationCap },
                            { name: 'Startup School', href: '/dashboard/yc', icon: BookOpen },
                        ].map((item) => (
                            <Link key={item.href} to={item.href}>
                                <div className="relative group">
                                    {pathname === item.href && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start relative z-10 hover:bg-transparent h-9",
                                            collapsed ? "px-2 justify-center" : "px-4"
                                        )}
                                        title={collapsed ? item.name : undefined}
                                    >
                                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className={cn("ml-3 truncate overflow-hidden text-sm", pathname === item.href && "font-medium text-primary")}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            {/* Credits & User */}
            <div className="p-4 border-t border-white/10 space-y-4">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Credits</span>
                                <span>{currentCredits}/{totalCredits}</span>
                            </div>
                            <Progress value={creditsPercent} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground text-center">
                                Resets in {resetDays} days
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-full p-0 hover:bg-transparent", collapsed ? "justify-center" : "justify-start")}>
                            <div className={cn("flex items-center gap-3 w-full", collapsed && "justify-center")}>
                                <Avatar className="h-9 w-9 border border-white/10">
                                    <AvatarImage src={userAvatar} />
                                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="flex-1 overflow-hidden text-left"
                                        >
                                            <p className="text-sm font-medium truncate">{userName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{planDisplayName} Plan</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
