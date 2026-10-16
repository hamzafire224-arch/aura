import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Zap, BarChart3,
    Layout, Menu, X, ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        {
            name: "Features",
            href: "/features",
            dropdown: [
                { title: "Content Studio", desc: "AI-powered content generation", icon: Zap, href: "/features/content-studio" },
                { title: "Financial Hub", desc: "Real-time financial tracking", icon: BarChart3, href: "/features/financial-hub" },
                { title: "Business Wizard", desc: "Launch in minutes", icon: Layout, href: "/features/business-wizard" },
            ]
        },

        { name: "Our Results", href: "/results" },
        { name: "About", href: "/about" },
        { name: "Pricing", href: "/pricing" },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed z-50 transition-all duration-300 left-0 right-0 mx-auto",
                isScrolled
                    ? "top-4 w-[90%] md:w-fit max-w-5xl rounded-full border border-white/10 bg-black/50 backdrop-blur-xl py-3 px-8 shadow-2xl shadow-primary/10"
                    : "top-0 w-full border-b border-transparent bg-transparent py-6 px-4"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 z-50 mr-8">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <span className="font-bold text-white">A</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">AURA</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                to={link.href}
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === link.href ? "text-white" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />}
                            </Link>

                            {/* Dropdown */}
                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-80"
                                        >
                                            <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-2xl overflow-hidden">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-4">
                                                        <div className="text-xs font-semibold text-muted-foreground pl-2">Creation & Growth</div>
                                                        <ListItem href="/features/content-studio" title="Content Studio">
                                                            AI Video & Image Generation
                                                        </ListItem>
                                                        <ListItem href="/features/ad-optimization" title="Pixel Perfect">
                                                            Ad Creative & ROAS AI
                                                        </ListItem>
                                                        <ListItem href="/features/market-intelligence" title="The Oracle">
                                                            Competitor Spy & Trends
                                                        </ListItem>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="text-xs font-semibold text-muted-foreground pl-2">Operations & Scale</div>
                                                        <ListItem href="/features/business-wizard" title="Business Wizard">
                                                            One-Click Business Launcher
                                                        </ListItem>
                                                        <ListItem href="/features/financial-hub" title="Financial Hub">
                                                            Profit Analysis & Accounting
                                                        </ListItem>
                                                        <ListItem href="/features/sales-autopilot" title="Velociraptor">
                                                            Automated Sales Agent
                                                        </ListItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="hidden md:flex items-center gap-6 ml-8">
                    <Link to="/login" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                        Log in
                    </Link>
                    <Link to="/signup">
                        <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">
                            Start Free
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white z-50"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6"
                        >
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <div key={link.name} className="space-y-4">
                                        <Link
                                            to={link.href}
                                            className="text-2xl font-bold text-white"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="pl-4 grid gap-4 border-l border-white/10">
                                                {link.dropdown.map((item, i) => (
                                                    <Link
                                                        key={i}
                                                        to={item.href}
                                                        className="text-muted-foreground hover:text-primary transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="h-px bg-white/10 my-4" />
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-lg")}>
                                    Log in
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "default" }), "w-full text-lg py-6 bg-primary text-primary-foreground")}>
                                    Start Free
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}

const ListItem = ({ href, title, children }: { href: string; title: string; children: React.ReactNode }) => (
    <Link
        to={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 group/item"
    >
        <div className="text-sm font-medium leading-none text-white group-hover/item:text-primary transition-colors">{title}</div>
        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
            {children}
        </p>
    </Link>
)
