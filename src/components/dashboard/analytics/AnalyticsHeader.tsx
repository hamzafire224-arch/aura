import { Calendar, Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AnalyticsHeaderProps {
    dateRange: string
    setDateRange: (value: string) => void
    dataToExport: any[]
    filename?: string
}

export function AnalyticsHeader({ dateRange, setDateRange, dataToExport, filename = "analytics-report" }: AnalyticsHeaderProps) {

    const handleExportCSV = () => {
        try {
            if (!dataToExport || dataToExport.length === 0) {
                toast.error("No data available to export")
                return
            }

            // Generate CSV Content
            const headers = Object.keys(dataToExport[0]).join(",")
            const rows = dataToExport.map(row => Object.values(row).join(","))
            const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")

            // Create Download Link
            const encodedUri = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success("Report downloaded successfully")
        } catch (e) {
            console.error("Export failed", e)
            toast.error("Failed to generate CSV")
        }
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial & Growth Command</h1>
                <p className="text-muted-foreground">Real-time performance metrics across your entire empire.</p>
            </div>
            <div className="flex gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last quarter</SelectItem>
                        <SelectItem value="1y">Year to Date</SelectItem>
                    </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-white/5 border-white/10">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportCSV}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled title="Coming in Enterprise Tier">
                            <FileText className="mr-2 h-4 w-4" /> Export PDF (Pro)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
