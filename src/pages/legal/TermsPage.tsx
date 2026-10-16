import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Scale } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
    const lastUpdated = "January 24, 2026"

    return (
        <div className="min-h-screen bg-black text-white">
            <title>Terms of Service | AURA Increase</title>
            <meta name="description" content="Terms of Service for AURA Increase - AI-powered e-commerce platform" />

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
                            <Scale className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Terms of Service</h1>
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
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using AURA Increase ("Service"), you agree to be bound by these Terms of Service ("Terms").
                            If you do not agree to these Terms, you may not access or use the Service.
                        </p>
                        <p>
                            These Terms apply to all visitors, users, and others who access or use the Service. By using our Service,
                            you represent that you are at least 18 years old and have the legal capacity to enter into this agreement.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>
                            AURA Increase provides an AI-powered platform for e-commerce research, content generation, store creation,
                            and business intelligence. The Service includes but is not limited to:
                        </p>
                        <ul>
                            <li>AI-powered niche and market research tools</li>
                            <li>Multi-agent debate systems for business validation</li>
                            <li>Product description and content generation</li>
                            <li>Shopify store integration and product syncing</li>
                            <li>Affiliate program and marketing tools</li>
                            <li>Analytics and competitor intelligence</li>
                        </ul>

                        <h2>3. Account Registration</h2>
                        <p>
                            To access certain features of the Service, you must register for an account. You agree to:
                        </p>
                        <ul>
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>

                        <h2>4. Subscription and Payments</h2>
                        <h3>4.1 Billing</h3>
                        <p>
                            Subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except as
                            expressly stated in our refund policy.
                        </p>
                        <h3>4.2 Automatic Renewal</h3>
                        <p>
                            Your subscription will automatically renew at the end of each billing period unless you cancel before the
                            renewal date. You may cancel your subscription at any time through your account settings.
                        </p>
                        <h3>4.3 Price Changes</h3>
                        <p>
                            We reserve the right to modify our pricing. Any price changes will be communicated at least 30 days in
                            advance and will apply to the next billing cycle.
                        </p>

                        <h2>5. Acceptable Use Policy</h2>
                        <p>You agree not to use the Service to:</p>
                        <ul>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe upon the rights of others, including intellectual property rights</li>
                            <li>Distribute malware, spam, or other harmful content</li>
                            <li>Attempt to gain unauthorized access to any part of the Service</li>
                            <li>Use automated systems to access the Service without our express permission</li>
                            <li>Create or promote fraudulent, misleading, or deceptive content</li>
                            <li>Resell or redistribute the Service without authorization</li>
                        </ul>

                        <h2>6. Intellectual Property</h2>
                        <h3>6.1 Our Content</h3>
                        <p>
                            The Service and its original content, features, and functionality are owned by AURA Increase and are
                            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <h3>6.2 Your Content</h3>
                        <p>
                            You retain ownership of content you create using the Service. By using the Service, you grant us a
                            non-exclusive, worldwide, royalty-free license to use, store, and process your content solely for the
                            purpose of providing the Service.
                        </p>
                        <h3>6.3 AI-Generated Content</h3>
                        <p>
                            Content generated by our AI tools is provided for your commercial use. You are responsible for reviewing
                            and ensuring the accuracy and appropriateness of any AI-generated content before use.
                        </p>

                        <h2>7. Third-Party Integrations</h2>
                        <p>
                            The Service integrates with third-party platforms (e.g., Shopify). Your use of these integrations is
                            subject to the respective third party's terms of service. We are not responsible for the availability,
                            accuracy, or practices of any third-party services.
                        </p>

                        <h2>8. Affiliate Program</h2>
                        <p>
                            Participation in our affiliate program is subject to our Affiliate Program Terms. Commission rates,
                            payment terms, and eligibility requirements are specified in those terms and may be modified at our discretion.
                        </p>

                        <h2>9. Disclaimers</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
                            IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                        <p>
                            AI-generated content, market analysis, and business recommendations are for informational purposes only
                            and should not be considered as financial, legal, or professional advice.
                        </p>

                        <h2>10. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AURA INCREASE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
                            DIRECTLY OR INDIRECTLY.
                        </p>
                        <p>
                            Our total liability for any claims arising from or related to the Service shall not exceed the amount
                            paid by you to AURA Increase during the twelve (12) months preceding the claim.
                        </p>

                        <h2>11. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless AURA Increase and its officers, directors, employees, and
                            affiliates from any claims, damages, losses, liabilities, and expenses arising from your use of the
                            Service or violation of these Terms.
                        </p>

                        <h2>12. Termination</h2>
                        <p>
                            We may terminate or suspend your account and access to the Service immediately, without prior notice,
                            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties,
                            or for any other reason at our sole discretion.
                        </p>

                        <h2>13. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
                            United States, without regard to its conflict of law provisions.
                        </p>

                        <h2>14. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will provide notice of significant changes
                            by posting the new Terms on the Service and updating the "Last Updated" date. Your continued use of
                            the Service after such changes constitutes acceptance of the new Terms.
                        </p>

                        <h2>15. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <ul>
                            <li>Email: legal@auraincrease.com</li>
                            <li>Website: https://auraincrease.com/contact</li>
                        </ul>
                    </div>
                </motion.article>
            </main>

            <Footer />
        </div>
    )
}
