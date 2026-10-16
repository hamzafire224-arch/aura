import { Link } from "react-router-dom"
import { Twitter, Linkedin, Youtube, Instagram } from "lucide-react"

const footerLinks = {
    product: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Roadmap", href: "/roadmap" },
        { label: "API Docs", href: "/api-docs" }
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" }
    ],
    resources: [
        { label: "Help Center", href: "/contact" },
        { label: "Community", href: "/blog" },
        { label: "Templates", href: "/features" },
        { label: "Affiliate Program", href: "/features/affiliate-system" }
    ],
    legal: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Security", href: "/security" }
    ]
}

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black/40 pt-16 pb-8">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary" />
                            <span className="text-2xl font-bold tracking-tight">AURA</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The Automated Universal Revenue Assistant. Your AI Co-Founder.
                        </p>
                        <div className="flex gap-4">
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                            <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="font-semibold capitalize">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2026 AURA Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    )
}
