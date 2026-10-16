import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, ArrowRight, TrendingUp, Users, MoreVertical, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useBusiness } from "@/contexts/BusinessContext"
import { toast } from "sonner"

interface BusinessCardProps {
    business: any
}

export function BusinessCard({ business }: BusinessCardProps) {
    const navigate = useNavigate()
    const { disconnectBusiness } = useBusiness()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        try {
            await disconnectBusiness(business.id)
            toast.success("Empire Deleted", { description: `${business.name} has been removed.` })
        } catch (error) {
            toast.error("Failed to delete business")
        }
    }

    return (
        <>
            <Card className="group overflow-hidden border-white/10 bg-black/20 hover:border-primary/50 transition-all duration-300 relative">
                {/* Visual Cover Header */}
                <div className="h-24 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-white/5 relative group-hover:from-indigo-950/30 group-hover:to-purple-950/30 transition-colors">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <Badge className="bg-black/50 backdrop-blur border-white/10 text-white hover:bg-black/70 capitalize">
                            {business.status || "Active"}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Empire
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <CardContent className="pt-0 relative">
                    {/* Logo Overlap */}
                    <div className="h-14 w-14 -mt-7 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-primary shadow-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-7 w-7" />
                    </div>

                    <div className="space-y-1 mb-4">
                        <h3 className="font-bold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors">
                            {business.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                            {business.description || `A ${business.type || 'venture'} in the ${business.industry || 'market'} space.`}
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5 bg-white/5 rounded-lg p-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground font-semibold">Revenue</span>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <TrendingUp className="h-3 w-3 text-emerald-500" /> ${business.revenue?.toLocaleString() || "0"}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground font-semibold">Visitors</span>
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <Users className="h-3 w-3 text-blue-500" /> {business.visitors?.toLocaleString() || "0"}
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between items-center bg-black/20 p-4">
                    <span className="capitalize">{business.type || business.industry || "General"}</span>
                    <Button
                        size="sm"
                        className="gap-2 bg-white text-black hover:bg-neutral-200"
                        onClick={() => navigate(`/dashboard/business/${business.id}`)}
                    >
                        Manage <ArrowRight className="h-3 w-3" />
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{business.name}</strong> and all its associated data (revenue, products, settings). This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
