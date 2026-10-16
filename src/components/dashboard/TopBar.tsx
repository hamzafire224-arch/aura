import { useState } from "react"
import { Bell, Search, Menu, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function TopBar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<{ label: string; path: string; type: string }[]>([])
    const [showResults, setShowResults] = useState(false)

    const searchableRoutes = [
        { label: "Dashboard Overview", path: "/dashboard", type: "Page" },
        { label: "My Businesses", path: "/dashboard/businesses", type: "Page" },
        { label: "New Business", path: "/dashboard/businesses/new", type: "Action" },
        { label: "Content Studio", path: "/dashboard/content", type: "Feature" },
        { label: "Financial Hub", path: "/dashboard/finance", type: "Feature" },
        { label: "Affiliate System", path: "/dashboard/affiliate", type: "Feature" },
        { label: "Settings", path: "/dashboard/settings", type: "Page" },
    ]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        if (query.length > 0) {
            const results = searchableRoutes.filter(route =>
                route.label.toLowerCase().includes(query.toLowerCase())
            )
            setSearchResults(results)
            setShowResults(true)
        } else {
            setShowResults(false)
        }
    }

    const handleSelectResult = (path: string) => {
        navigate(path)
        setSearchQuery("")
        setShowResults(false)
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 px-6 backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-4 md:gap-8">
                {/* Mobile Menu Trigger (Hidden on desktop) */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Breadcrumbs (Placeholder) */}
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium">Overview</span>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md ml-auto md:ml-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search businesses, content, or help..."
                        className="w-full bg-background/50 pl-9 md:w-[300px] lg:w-[400px] border-white/10 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={handleSearch}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        onFocus={() => searchQuery && setShowResults(true)}
                    />
                    <div className="absolute right-2.5 top-2.5 hidden md:flex items-center gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-full rounded-md border border-white/10 bg-card shadow-lg overflow-hidden z-50">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors"
                                    onMouseDown={() => handleSelectResult(result.path)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Command className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm">{result.label}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] h-5">{result.type}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">New Order #1024</span>
                                    <span className="text-xs text-muted-foreground">2m ago</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    New order received from Urban Leather Co. Total: $124.50
                                </p>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">Content Generated</span>
                                    <span className="text-xs text-muted-foreground">1h ago</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    30 social posts for next week are ready for review.
                                </p>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-primary font-medium cursor-pointer">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-white/10">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/finance")}>
                            Billing
                            <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-primary/20 text-primary hover:bg-primary/30">
                                Pro
                            </Badge>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={signOut}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
