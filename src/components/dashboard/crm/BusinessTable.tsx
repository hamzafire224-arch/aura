import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BusinessTableProps {
    businesses: any[]
}

export function BusinessTable({ businesses }: BusinessTableProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-md border border-white/10 bg-black/20">
            <Table>
                <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="w-[300px]">Business Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Revenue (MTD)</TableHead>
                        <TableHead className="text-right">Visitors (Live)</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {businesses.map((business) => {
                        const status = business.status ?? 'active'
                        return (
                            <TableRow key={business.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-primary">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{business.name}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-1">{business.description || "No description"}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-white/10 bg-white/5 capitalize">
                                        {business.type || business.industry || "General"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                        <span className="capitalize text-sm">{status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    ${business.revenue != null ? business.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-muted-foreground">
                                    {business.visitors?.toLocaleString() || "0"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigate(`/dashboard/business/${business.id}`)}>
                                                Enter Dashboard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-400">Archive Business</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {businesses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No active businesses found. Launch your first empire.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
