import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Code, ExternalLink, ArrowRight, Terminal, Zap, Lock } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

const endpoints = [
    { method: "POST", path: "/api/v1/businesses", description: "Create a new business" },
    { method: "GET", path: "/api/v1/businesses/:id", description: "Get business details" },
    { method: "POST", path: "/api/v1/content/generate", description: "Generate AI content" },
    { method: "GET", path: "/api/v1/analytics/revenue", description: "Get revenue analytics" },
    { method: "POST", path: "/api/v1/products/sync", description: "Sync products with Shopify" },
    { method: "GET", path: "/api/v1/competitors/:id", description: "Get competitor analysis" }
]

const features = [
    { icon: Terminal, title: "RESTful API", description: "Clean, predictable resource-oriented URLs" },
    { icon: Lock, title: "OAuth 2.0", description: "Secure authentication with access tokens" },
    { icon: Zap, title: "Webhooks", description: "Real-time event notifications" }
]

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>API Documentation | AURA Increase</title>
            <meta name="description" content="AURA API documentation - integrate AI-powered business tools into your applications" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary">Developer API</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        API Documentation
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Integrate AURA's powerful AI capabilities into your own applications with our RESTful API.
                    </motion.p>
                    <a href="https://docs.auraincrease.com" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            View Full Docs <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                </section>

                {/* Features */}
                <section className="container mx-auto px-4 mb-16">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Quick Start */}
                <section className="container mx-auto px-4 mb-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">Quick Start</h2>
                        <div className="p-6 rounded-xl bg-zinc-900 border border-white/10 font-mono text-sm overflow-x-auto">
                            <div className="text-muted-foreground mb-4"># Install the SDK</div>
                            <div className="text-green-400 mb-4">npm install @aura/sdk</div>
                            <div className="text-muted-foreground mb-4"># Initialize with your API key</div>
                            <div className="text-white">
                                <span className="text-purple-400">import</span> {"{"} Aura {"}"} <span className="text-purple-400">from</span> <span className="text-green-400">'@aura/sdk'</span>;
                            </div>
                            <div className="text-white mt-2">
                                <span className="text-purple-400">const</span> aura = <span className="text-purple-400">new</span> <span className="text-yellow-400">Aura</span>(process.env.AURA_API_KEY);
                            </div>
                            <div className="text-white mt-4">
                                <span className="text-muted-foreground">// Generate content</span>
                            </div>
                            <div className="text-white">
                                <span className="text-purple-400">const</span> content = <span className="text-purple-400">await</span> aura.content.<span className="text-yellow-400">generate</span>({"{"}<br />
                                <span className="ml-4">type: <span className="text-green-400">'product_description'</span>,</span><br />
                                <span className="ml-4">product: <span className="text-green-400">'Premium Yoga Mat'</span></span><br />
                                {"}"});
                            </div>
                        </div>
                    </div>
                </section>

                {/* Endpoints Preview */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">Sample Endpoints</h2>
                        <div className="space-y-3">
                            {endpoints.map((endpoint, index) => (
                                <motion.div
                                    key={endpoint.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${endpoint.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                                        {endpoint.method}
                                    </span>
                                    <code className="text-sm font-mono text-white flex-1">{endpoint.path}</code>
                                    <span className="text-sm text-muted-foreground hidden md:block">{endpoint.description}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Get your API key and start integrating AURA's AI capabilities today.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Get API Key <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="https://docs.auraincrease.com" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" variant="outline" className="border-white/20">
                                    Full Documentation <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
