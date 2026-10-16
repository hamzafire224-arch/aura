import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Cookie } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

export default function CookiePage() {
    const lastUpdated = "January 24, 2026"

    return (
        <div className="min-h-screen bg-black text-white">
            <title>Cookie Policy | AURA Increase</title>
            <meta name="description" content="Cookie Policy for AURA Increase - How we use cookies and similar technologies" />

            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 mb-8">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 max-w-4xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <Cookie className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Cookie Policy</h1>
                            <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white
                        prose-ul:text-gray-300
                        prose-li:marker:text-primary
                    ">
                        <h2>1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are placed on your device when you visit a website.
                            They are widely used to make websites work efficiently and provide information to website owners.
                        </p>

                        <h2>2. How We Use Cookies</h2>
                        <p>AURA Increase uses cookies for several purposes:</p>

                        <h3>Essential Cookies</h3>
                        <p>
                            These cookies are necessary for the website to function properly. They enable core
                            functionality such as security, session management, and accessibility preferences.
                        </p>
                        <ul>
                            <li><strong>Session cookies:</strong> Maintain your login state</li>
                            <li><strong>Security cookies:</strong> Protect against CSRF attacks</li>
                            <li><strong>Preference cookies:</strong> Remember your settings</li>
                        </ul>

                        <h3>Analytics Cookies</h3>
                        <p>
                            We use analytics cookies to understand how visitors interact with our website.
                            This helps us improve our service and user experience.
                        </p>
                        <ul>
                            <li><strong>Google Analytics:</strong> Tracks page views, session duration, and user flow</li>
                            <li><strong>Internal analytics:</strong> Measures feature usage and performance</li>
                        </ul>

                        <h3>Marketing Cookies</h3>
                        <p>
                            These cookies track your activity to deliver personalized advertising and measure campaign effectiveness.
                        </p>

                        <h3>Affiliate Tracking Cookies</h3>
                        <p>
                            We use cookies with a 90-day duration to track affiliate referrals. These cookies help us
                            attribute signups to the correct affiliate partner and ensure proper commission payouts.
                        </p>

                        <h2>3. Types of Cookies We Use</h2>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-3 pr-4">Cookie Name</th>
                                    <th className="py-3 pr-4">Purpose</th>
                                    <th className="py-3">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 pr-4">aura_session</td>
                                    <td className="py-3 pr-4">Session management</td>
                                    <td className="py-3">Session</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 pr-4">aura_auth</td>
                                    <td className="py-3 pr-4">Authentication</td>
                                    <td className="py-3">30 days</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 pr-4">aura_ref</td>
                                    <td className="py-3 pr-4">Affiliate tracking</td>
                                    <td className="py-3">90 days</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 pr-4">_ga</td>
                                    <td className="py-3 pr-4">Google Analytics</td>
                                    <td className="py-3">2 years</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>4. Managing Cookies</h2>
                        <p>
                            You can control and manage cookies in several ways:
                        </p>
                        <ul>
                            <li><strong>Browser settings:</strong> Most browsers allow you to refuse or delete cookies through settings</li>
                            <li><strong>Opt-out links:</strong> Use Google's opt-out browser add-on for Google Analytics</li>
                            <li><strong>Cookie banner:</strong> Use our cookie consent banner to manage preferences</li>
                        </ul>
                        <p>
                            Note that disabling certain cookies may impact the functionality of our website.
                        </p>

                        <h2>5. Third-Party Cookies</h2>
                        <p>
                            Some cookies are placed by third-party services that appear on our pages. We do not
                            control these cookies. Third parties include:
                        </p>
                        <ul>
                            <li>Google Analytics</li>
                            <li>Stripe (payment processing)</li>
                            <li>Intercom (customer support)</li>
                        </ul>

                        <h2>6. Updates to This Policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time. We will notify you of any changes
                            by posting the new policy on this page and updating the "Last Updated" date.
                        </p>

                        <h2>7. Contact Us</h2>
                        <p>
                            If you have questions about our use of cookies, please contact us at:
                        </p>
                        <ul>
                            <li>Email: privacy@auraincrease.com</li>
                            <li>Website: <Link to="/contact" className="text-primary">Contact Page</Link></li>
                        </ul>
                    </div>
                </motion.article>
            </main>

            <Footer />
        </div>
    )
}
