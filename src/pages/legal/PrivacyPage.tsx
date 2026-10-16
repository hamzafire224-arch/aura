import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
    const lastUpdated = "January 24, 2026"

    return (
        <div className="min-h-screen bg-black text-white">
            <title>Privacy Policy | AURA Increase</title>
            <meta name="description" content="Privacy Policy for AURA Increase - How we collect, use, and protect your data" />

            <Navbar />

            <main className="pt-24 pb-20">
                {/* Header */}
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
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
                        prose-ul:text-gray-300 prose-ol:text-gray-300
                        prose-li:marker:text-primary
                    ">
                        <h2>1. Introduction</h2>
                        <p>
                            AURA Increase ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you use our Service.
                        </p>
                        <p>
                            Please read this policy carefully. If you do not agree with the terms of this Privacy Policy,
                            please do not access or use the Service.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <h3>2.1 Information You Provide</h3>
                        <p>We collect information you provide directly to us, including:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                            <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely via third-party payment processors)</li>
                            <li><strong>Business Information:</strong> Store details, product information, and business data you input</li>
                            <li><strong>Communications:</strong> Messages, feedback, and support inquiries</li>
                        </ul>

                        <h3>2.2 Information Collected Automatically</h3>
                        <p>When you use our Service, we automatically collect:</p>
                        <ul>
                            <li><strong>Usage Data:</strong> Pages visited, features used, time spent, and interaction patterns</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address</li>
                            <li><strong>Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
                            <li><strong>Affiliate Tracking:</strong> Referral codes and attribution data (90-day cookie duration)</li>
                        </ul>

                        <h3>2.3 Information from Third Parties</h3>
                        <p>We may receive information from third-party services you connect, including:</p>
                        <ul>
                            <li><strong>Shopify:</strong> Store data, product information, and order details (via OAuth)</li>
                            <li><strong>Authentication Providers:</strong> Profile information from social login</li>
                        </ul>

                        <h2>3. How We Use Your Information</h2>
                        <p>We use collected information to:</p>
                        <ul>
                            <li>Provide, maintain, and improve the Service</li>
                            <li>Process transactions and send billing information</li>
                            <li>Generate AI-powered insights, content, and recommendations</li>
                            <li>Personalize your experience and remember preferences</li>
                            <li>Send administrative notifications and updates</li>
                            <li>Respond to support requests and communications</li>
                            <li>Track affiliate referrals and process commissions</li>
                            <li>Detect and prevent fraud, abuse, and security threats</li>
                            <li>Analyze usage patterns to improve our services</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2>4. How We Share Your Information</h2>
                        <p>We may share your information with:</p>
                        <h3>4.1 Service Providers</h3>
                        <p>
                            Third-party vendors who perform services on our behalf, including payment processing (Stripe/LemonSqueezy),
                            email delivery (Resend), hosting (Supabase), and analytics providers.
                        </p>
                        <h3>4.2 Third-Party Integrations</h3>
                        <p>
                            When you connect third-party services (e.g., Shopify), we share necessary data to enable the integration.
                            Your use of these integrations is subject to their respective privacy policies.
                        </p>
                        <h3>4.3 Legal Requirements</h3>
                        <p>
                            We may disclose information when required by law, court order, or governmental authority, or when
                            necessary to protect our rights, safety, or property.
                        </p>
                        <h3>4.4 Business Transfers</h3>
                        <p>
                            In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                            part of the transaction.
                        </p>
                        <p><strong>We do not sell your personal information to third parties.</strong></p>

                        <h2>5. Data Retention</h2>
                        <p>
                            We retain your information for as long as your account is active or as needed to provide services,
                            comply with legal obligations, resolve disputes, and enforce agreements.
                        </p>
                        <p>
                            Upon account deletion request, we will delete or anonymize your personal data within 30 days,
                            except for data we are required to retain for legal or legitimate business purposes.
                        </p>

                        <h2>6. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your information, including:
                        </p>
                        <ul>
                            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                            <li>Secure authentication and access controls</li>
                            <li>Regular security assessments and monitoring</li>
                            <li>OAuth-based integrations (we never store your third-party passwords)</li>
                        </ul>
                        <p>
                            While we strive to protect your information, no method of transmission or storage is 100% secure.
                            We cannot guarantee absolute security.
                        </p>

                        <h2>7. Your Rights and Choices</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                            <li><strong>Portability:</strong> Receive your data in a portable format</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Cookie Preferences:</strong> Manage cookie settings in your browser</li>
                        </ul>
                        <p>
                            To exercise these rights, contact us at privacy@auraincrease.com. We will respond within 30 days.
                        </p>

                        <h2>8. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies for:</p>
                        <ul>
                            <li><strong>Essential:</strong> Necessary for Service functionality</li>
                            <li><strong>Analytics:</strong> Understanding usage patterns (Google Analytics)</li>
                            <li><strong>Preferences:</strong> Remembering your settings</li>
                            <li><strong>Affiliate Tracking:</strong> 90-day attribution cookies for referral programs</li>
                        </ul>
                        <p>
                            You can disable cookies in your browser settings, though some features may not function properly.
                        </p>

                        <h2>9. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your country of residence.
                            We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                        </p>

                        <h2>10. Children's Privacy</h2>
                        <p>
                            The Service is not intended for users under 18 years of age. We do not knowingly collect personal
                            information from children. If we become aware of such collection, we will delete the information promptly.
                        </p>

                        <h2>11. California Privacy Rights (CCPA)</h2>
                        <p>
                            California residents have additional rights under the California Consumer Privacy Act (CCPA):
                        </p>
                        <ul>
                            <li>Right to know what personal information is collected</li>
                            <li>Right to know if personal information is sold or disclosed</li>
                            <li>Right to opt-out of the sale of personal information</li>
                            <li>Right to non-discrimination for exercising privacy rights</li>
                        </ul>
                        <p>
                            We do not sell personal information. To exercise your CCPA rights, contact privacy@auraincrease.com.
                        </p>

                        <h2>12. European Privacy Rights (GDPR)</h2>
                        <p>
                            If you are in the European Economic Area (EEA), you have rights under the General Data Protection
                            Regulation (GDPR), including access, rectification, erasure, restriction, portability, and objection.
                        </p>
                        <p>
                            Our legal basis for processing includes: consent, contract performance, legitimate interests, and legal obligations.
                        </p>

                        <h2>13. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by
                            posting the new policy and updating the "Last Updated" date. Your continued use of the Service
                            after changes constitutes acceptance of the updated policy.
                        </p>

                        <h2>14. Contact Us</h2>
                        <p>
                            If you have questions or concerns about this Privacy Policy or our data practices, contact us at:
                        </p>
                        <ul>
                            <li>Email: privacy@auraincrease.com</li>
                            <li>Website: https://auraincrease.com/contact</li>
                        </ul>
                    </div>
                </motion.article>
            </main>

            <Footer />
        </div>
    )
}
