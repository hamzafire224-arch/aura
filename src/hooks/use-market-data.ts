import { useState, useEffect } from "react"

export interface MarketData {
    crypto: {
        btc: { price: number, change24h: number, history: any[] }
        eth: { price: number, change24h: number, history: any[] }
    }
    stocks: {
        netWorth: number
        sp500: { price: number, change: number }
    }
    business: {
        cash: number
        burnRate: number
        runwayDays: number
        profitMonth: number
    }
    timestamp: number
    isConnected: boolean
}

// Persisted initial values
const STORAGE_KEY = 'aura_wealth_data'
const DEFAULT_WEALTH = {
    netWorth: 142500,
    cash: 45000,
    burnRate: 3200,
    profitMonth: 8500
}

export function useMarketData() {
    const [cryptoData, setCryptoData] = useState({ btc: 64000, eth: 3400 })
    const [isConnected, setIsConnected] = useState(false)
    const [wealth, setWealth] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : DEFAULT_WEALTH
        } catch {
            return DEFAULT_WEALTH
        }
    })

    // Persist wealth changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wealth))
    }, [wealth])

    // Binance WebSocket for Real-Time Pricing (Peak Tech)
    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade/ethusdt@trade')

        ws.onopen = () => {
            console.log('[MarketEngine] Connected to Binance Stream')
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            const price = parseFloat(message.p)

            if (message.s === 'BTCUSDT') {
                setCryptoData(prev => ({ ...prev, btc: price }))
            } else if (message.s === 'ETHUSDT') {
                setCryptoData(prev => ({ ...prev, eth: price }))
            }
        }

        ws.onclose = () => setIsConnected(false)

        return () => ws.close()
    }, [])

    // Dynamic Net Worth Calculation
    const totalCryptoValue = (cryptoData.btc * 0.5) + (cryptoData.eth * 4) // Assuming 0.5 BTC and 4 ETH holdings for start
    const totalNetWorth = wealth.netWorth + totalCryptoValue

    return {
        isLoading: !isConnected,
        data: {
            crypto: {
                btc: { price: cryptoData.btc, change24h: 2.4, history: [] },
                eth: { price: cryptoData.eth, change24h: 1.1, history: [] }
            },
            stocks: {
                netWorth: totalNetWorth,
                sp500: { price: 5120, change: 0.5 } // Placeholder for Finnhub
            },
            business: {
                cash: wealth.cash,
                burnRate: wealth.burnRate,
                runwayDays: wealth.burnRate > 0 ? Math.floor(wealth.cash / (wealth.burnRate / 30)) : 999,
                profitMonth: wealth.profitMonth
            },
            timestamp: Date.now(),
            isConnected
        } as MarketData,
        updateWealth: setWealth
    }
}
