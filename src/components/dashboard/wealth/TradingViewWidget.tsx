import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"

export function TradingViewWidget() {
    return (
        <div className="flex-1 w-full h-[500px] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <AdvancedRealTimeChart
                theme="dark"
                autosize
                symbol="BINANCE:BTCUSDT"
                interval="D"
                timezone="Etc/UTC"
                style="1"
                locale="en"
                toolbar_bg="#f1f3f6"
                enable_publishing={false}
                hide_top_toolbar={false}
                hide_legend={false}
                save_image={false}
                container_id="tradingview_widget"
            />
        </div>
    )
}
