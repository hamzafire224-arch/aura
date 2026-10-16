import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react"

interface TrustBadgeGridProps {
    badges?: Array<{ icon: string, title: string, subtitle: string }>
    theme?: any
}

export function TrustBadgeGrid({ badges, theme }: TrustBadgeGridProps) {

    const primaryColor = theme?.colors?.primary || '#000'

    const defaultBadges = [
        { icon: 'shield', title: "Secure Checkout", subtitle: "256-bit SSL Encrypted" },
        { icon: 'truck', title: "Fast Shipping", subtitle: "2-Day Delivery Available" },
        { icon: 'return', title: "30-Day Returns", subtitle: "Risk-Free Guarantee" },
        { icon: 'award', title: "Premium Quality", subtitle: "Certified Authentic" }
    ]

    const displayBadges = badges || defaultBadges

    const getIcon = (name: string) => {
        switch (name) {
            case 'shield': return <ShieldCheck className="h-8 w-8 mb-3" />
            case 'truck': return <Truck className="h-8 w-8 mb-3" />
            case 'return': return <RotateCcw className="h-8 w-8 mb-3" />
            case 'award': return <Award className="h-8 w-8 mb-3" />
            default: return <ShieldCheck className="h-8 w-8 mb-3" />
        }
    }

    return (
        <div className="w-full py-12 border-t border-b border-black/5 bg-gray-50/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto">
                {displayBadges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center group">
                        <div
                            className="bg-white p-4 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 text-gray-800"
                            style={{ color: primaryColor }}
                        >
                            {getIcon(badge.icon)}
                        </div>
                        <h4 className="font-semibold text-sm uppercase tracking-wide mb-1">{badge.title}</h4>
                        <p className="text-xs text-muted-foreground">{badge.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    )
} 
