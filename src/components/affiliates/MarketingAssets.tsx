import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, FileText, Image as ImageIcon, Video, MessageSquare, Mail, Twitter } from "lucide-react"
import { toast } from "sonner"

export function MarketingAssets() {
    const swipeCopy = [
        {
            title: "The 'Secret Weapon' Email",
            icon: Mail,
            subject: "How I built a store in 5 minutes (AI)",
            body: `Hey [FIRST NAME],

I just found this insane tool called Aura. 

It uses 3 AI agents to debate strategy and build a Shopify store for you. It's like having McKinsey in your pocket...

The craziest part? I'm earning 40% recurring commission just by sharing my link. 

Check it out: [YOUR LINK]

– [YOUR NAME]`
        },
        {
            title: "The 'Twitter Thread' Hook",
            icon: Twitter,
            body: `🧵 Dropshipping is dead. AI Commerce is alive.

Here is how I used Aura to find a winning product in 30 seconds:

1. Spied on competitors
2. AI Analyst verified margins  
3. Launched.

The best part? I earn 40% lifetime commission on every referral.

Try it here: [YOUR LINK]`
        },
        {
            title: "The 'DM Intro' Script",
            icon: MessageSquare,
            body: `Hey! Saw you're into e-commerce.

I've been using this AI tool called Aura that basically creates entire Shopify stores using AI agents that literally argue about strategy 😂

It found me a product with 65% margins in like 30 seconds. Thought you might find it useful:

[YOUR LINK]

LMK if you have questions!`
        },
        {
            title: "The 'YouTube Description'",
            icon: Video,
            body: `🚀 Try AURA (The AI E-commerce Platform I Use): [YOUR LINK]
📈 Use code [YOUR_CODE] for 40% lifetime commissions

AURA uses 3 AI agents (Analyst, Strategist, Designer) to:
- Find winning products in seconds
- Spy on competitor strategies  
- Build stores automatically

#dropshipping #ecommerce #ai #shopify`
        }
    ]

    const graphics = [
        { name: "3D Hero Banner", size: "1920x1080", type: "banner" },
        { name: "Social Card", size: "1200x630", type: "social" },
        { name: "Instagram Story", size: "1080x1920", type: "story" },
        { name: "YouTube Thumbnail", size: "1280x720", type: "thumbnail" },
    ]

    const handleCopy = (text: string, title: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`Copied: ${title}`)
    }

    const handleDownload = (name: string) => {
        toast.info(`Downloading ${name}...`, { description: "Asset will be available soon" })
    }

    return (
        <Card className="bg-black/40 border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Marketing Kit
            </h3>

            <Tabs defaultValue="copy" className="w-full">
                <TabsList className="bg-black/50 border border-white/10 mb-4 grid grid-cols-3">
                    <TabsTrigger value="copy">Swipe Copy</TabsTrigger>
                    <TabsTrigger value="graphics">Graphics</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>

                <TabsContent value="copy" className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {swipeCopy.map((item, i) => (
                        <div key={i} className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-blue-400" />
                                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => handleCopy(item.body, item.title)}>
                                    <Copy className="w-4 h-4 mr-2" /> Copy
                                </Button>
                            </div>
                            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-sans bg-black/30 p-2 rounded max-h-[120px] overflow-y-auto">
                                {item.body}
                            </pre>
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="graphics">
                    <div className="grid grid-cols-2 gap-4">
                        {graphics.map((item, i) => (
                            <div key={i} className="group relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all">
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <ImageIcon className="w-8 h-8 text-gray-600" />
                                    <span className="text-xs text-gray-500">{item.size}</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" size="sm" onClick={() => handleDownload(item.name)}>
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-center">
                                    <span className="text-xs text-white font-medium">{item.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="videos">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: "Product Demo (15s)", duration: "0:15" },
                            { name: "Feature Highlight (30s)", duration: "0:30" },
                        ].map((item, i) => (
                            <div key={i} className="group relative aspect-video bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <Video className="w-8 h-8 text-purple-500/50" />
                                    <span className="text-xs text-gray-500">{item.duration}</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" size="sm" onClick={() => handleDownload(item.name)}>
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-center">
                                    <span className="text-xs text-white font-medium">{item.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        More videos coming soon! Request custom assets in Discord.
                    </p>
                </TabsContent>
            </Tabs>
        </Card>
    )
}

