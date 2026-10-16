import { Check, X } from "lucide-react"

interface ComparisonTableProps {
    competitorName?: string
    theme?: any
}

export function ComparisonTable({ competitorName = "Generic Brands", theme }: ComparisonTableProps) {
    const primaryColor = theme?.colors?.primary || '#000'


    const features = [
        { name: "Premium Materials", us: true, them: false },
        { name: "Lifetime Warranty", us: true, them: false },
        { name: "Eco-Friendly", us: true, them: true },
        { name: "24/7 Support", us: true, them: false },
        { name: "Free Shipping", us: true, them: false }
    ]

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4">
            <h3 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h3>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="grid grid-cols-3 p-6 border-b bg-gray-50/50">
                    <div className="font-semibold text-gray-500">Feature</div>
                    <div className="font-bold text-center text-lg" style={{ color: primaryColor }}>Us</div>
                    <div className="font-semibold text-center text-gray-400">{competitorName}</div>
                </div>

                {/* Rows */}
                {features.map((feature, i) => (
                    <div key={i} className="grid grid-cols-3 p-6 border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-800 flex items-center">{feature.name}</div>

                        <div className="flex justify-center">
                            {feature.us ? (
                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-emerald-600" />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <X className="h-5 w-5 text-red-600" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            {feature.them ? (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-gray-400" />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <X className="h-5 w-5 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
