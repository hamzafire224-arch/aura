import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border bg-card text-card-foreground shadow">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-[60px]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
                <div className="col-span-3 p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
