import { WealthHeader } from "@/components/dashboard/wealth/WealthHeader"
import { TradingViewWidget } from "@/components/dashboard/wealth/TradingViewWidget"
import { AssetAllocation } from "@/components/dashboard/wealth/AssetAllocation"
import { BrokerConnect } from "@/components/dashboard/wealth/BrokerConnect"

export default function Wealth() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in pb-20">
            {/* Header / Stats Ticker */}
            <WealthHeader />

            {/* Main Trading Terminal Area */}
            <div className="grid gap-6 md:grid-cols-3 h-[600px]">
                {/* Visual: Big beautiful chart takes up 2/3 */}
                <div className="md:col-span-2 h-full flex flex-col gap-4">
                    <TradingViewWidget />

                    {/* Quick Action Bar (Buy/Sell Simulation) */}
                    <div className="grid grid-cols-2 gap-4 h-full max-h-[100px]">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-colors group">
                            <span className="text-emerald-500 font-bold text-lg group-hover:scale-110 transition-transform">BUY BTC</span>
                        </div>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-rose-500/20 transition-colors group">
                            <span className="text-rose-500 font-bold text-lg group-hover:scale-110 transition-transform">SELL BTC</span>
                        </div>
                    </div>
                </div>

                {/* Side Panel: Assets & Brokers */}
                <div className="h-full flex flex-col gap-6">
                    <div className="h-[350px]">
                        <AssetAllocation />
                    </div>
                    <div className="flex-1">
                        <BrokerConnect />
                    </div>
                </div>
            </div>
        </div>
    )
}
