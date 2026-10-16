import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, CandlestickSeries, type CandlestickData, type Time } from "lightweight-charts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { MarketData } from "@/hooks/use-market-data"
import { Zap } from "lucide-react"

interface ViewProps {
    data: MarketData
}

export function CryptoTerminal({ data }: ViewProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const [chart, setChart] = useState<any>(null)
    const [series, setSeries] = useState<any>(null)

    // Price Flash Logic
    const [priceColor, setPriceColor] = useState("text-white")
    const prevPrice = useRef(data.crypto.btc.price)

    useEffect(() => {
        if (data.crypto.btc.price > prevPrice.current) setPriceColor("text-green-400")
        else if (data.crypto.btc.price < prevPrice.current) setPriceColor("text-red-400")

        const t = setTimeout(() => setPriceColor("text-white"), 500)
        prevPrice.current = data.crypto.btc.price
        return () => clearTimeout(t)
    }, [data.crypto.btc.price])

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        const newChart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        })

        const newSeries = newChart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        })

        // Initial Load: Fetch Real History from Binance API
        const fetchHistory = async () => {
            try {
                const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100')
                const data = await res.json()

                // Binance API returns array of arrays: [time, open, high, low, close, volume, ...]
                const candles: CandlestickData<Time>[] = data.map((c: any) => ({
                    time: (c[0] / 1000) as Time, // TV Charts uses seconds
                    open: parseFloat(c[1]),
                    high: parseFloat(c[2]),
                    low: parseFloat(c[3]),
                    close: parseFloat(c[4])
                }))

                newSeries.setData(candles)
            } catch (e) {
                console.error("Failed to load history", e)
            }
        }

        fetchHistory()

        setChart(newChart)
        setSeries(newSeries)

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            newChart.remove()
        }
    }, [])

    // Real-time Update (Simulation)
    useEffect(() => {
        if (!series) return

        // Update the last candle logic would go here
        // For now, we rely on the component re-rendering with new price prop
    }, [data.crypto.btc.price])

    return (
        <div className="h-full p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-500/20 p-2 rounded-full">
                            <Zap className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-mono">BTC/USDT</h2>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>Bitcoin</span>
                                <span className="text-green-500">+2.4%</span>
                            </div>
                        </div>
                    </div>

                    <div className={`text-4xl font-mono font-bold transition-colors duration-300 ${priceColor}`}>
                        ${data.crypto.btc.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold h-12 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all">
                            Quick Buy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0B0E14]/90 border-white/10 backdrop-blur-2xl">
                        <DialogHeader>
                            <DialogTitle>Quick Execute</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Amount (USDT)</label>
                                <Input placeholder="5000" className="bg-white/5 border-white/10 text-2xl font-mono" />
                            </div>
                            <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold h-12">
                                Confirm Buy Order
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="p-1 bg-black/40 border-white/10 relative h-[600px] overflow-hidden rounded-xl">
                <div ref={chartContainerRef} className="absolute inset-0" />
            </Card>
        </div>
    )
}
