import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Lock, Server, Eye, Key, CheckCircle } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

const securityFeatures = [
    { icon: Lock, title: "Encryption at Rest", description: "All data is encrypted using AES-256 encryption" },
    { icon: Server, title: "Encryption in Transit", description: "TLS 1.3 for all data transmission" },
    { icon: Key, title: "OAuth 2.0", description: "Secure third-party integrations without password sharing" },
    { icon: Eye, title: "Access Controls", description: "Role-based access with audit logging" }
]

const certifications = [
    "SOC 2 Type II Compliant",
    "GDPR Compliant",
    "CCPA Compliant",
    "PCI DSS Level 1"
]

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <title>Security | AURA Increase</title>
            <meta name="description" content="Learn about AURA's security practices and how we protect your data" />

            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 mb-8">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 max-w-4xl"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">Enterprise-Grade Security</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Security at AURA</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Your data security is our top priority. We implement industry-leading security
                            measures to protect your business information.
                        </p>
                    </div>

                    {/* Security Features */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Security Infrastructure</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {securityFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Compliance & Certifications</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {certifications.map((cert, index) => (
                                <motion.div
                                    key={cert}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center"
                                >
                                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                    <span className="text-sm font-medium">{cert}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Details */}
                    <section className="prose prose-invert prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-ul:text-gray-300
                        prose-li:marker:text-green-500
                    ">
                        <h2>Data Protection</h2>
                        <ul>
                            <li>All customer data is encrypted at rest using AES-256 encryption</li>
                            <li>Data is stored in geographically redundant data centers</li>
                            <li>Regular automated backups with point-in-time recovery</li>
                            <li>Strict data retention policies with secure deletion</li>
                        </ul>

                        <h2>Application Security</h2>
                        <ul>
                            <li>Regular penetration testing by third-party security firms</li>
                            <li>Automated vulnerability scanning in CI/CD pipeline</li>
                            <li>Web Application Firewall (WAF) protection</li>
                            <li>DDoS mitigation and rate limiting</li>
                            <li>Input validation and output encoding to prevent XSS/SQL injection</li>
                        </ul>

                        <h2>Access Security</h2>
                        <ul>
                            <li>Multi-factor authentication (MFA) available for all accounts</li>
                            <li>SSO integration support for enterprise customers</li>
                            <li>Session management with automatic timeout</li>
                            <li>Brute force protection with account lockout</li>
                        </ul>

                        <h2>Third-Party Integrations</h2>
                        <ul>
                            <li>OAuth 2.0 for Shopify and other integrations (no password storage)</li>
                            <li>Regular security audits of integration partners</li>
                            <li>Minimal permission scopes requested</li>
                            <li>Token rotation and revocation capabilities</li>
                        </ul>

                        <h2>Incident Response</h2>
                        <ul>
                            <li>24/7 security monitoring and alerting</li>
                            <li>Documented incident response procedures</li>
                            <li>Breach notification within 72 hours as required by GDPR</li>
                            <li>Post-incident analysis and remediation</li>
                        </ul>

                        <h2>Report a Vulnerability</h2>
                        <p>
                            We appreciate the security research community's efforts in helping keep AURA secure.
                            If you discover a security vulnerability, please report it responsibly to:
                        </p>
                        <ul>
                            <li>Email: security@auraincrease.com</li>
                            <li>PGP Key available upon request</li>
                        </ul>
                    </section>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
