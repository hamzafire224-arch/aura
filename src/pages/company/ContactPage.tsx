import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, Clock, CheckCircle } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const contactMethods = [
    {
        icon: Mail,
        title: "Email Support",
        description: "Get help from our support team",
        value: "support@auraincrease.com",
        href: "mailto:support@auraincrease.com"
    },
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Chat with us in real-time",
        value: "Available 24/7",
        href: "#"
    },
    {
        icon: Clock,
        title: "Response Time",
        description: "Average first response",
        value: "< 2 hours",
        href: "#"
    }
]

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        toast.success("Message sent! We'll get back to you within 24 hours.")

        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" })
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <title>Contact Us | AURA Increase</title>
            <meta name="description" content="Get in touch with the AURA team - we're here to help" />

            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </motion.p>
                </section>

                {/* Contact Methods */}
                <section className="container mx-auto px-4 mb-16">
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <method.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-bold mb-1">{method.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                                <p className="text-primary font-medium">{method.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10"
                        >
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Thanks for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Name</label>
                                            <Input
                                                required
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-black/50 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-black/50 border-white/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input
                                            required
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="bg-black/50 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea
                                            required
                                            rows={5}
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="bg-black/50 border-white/10 resize-none"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
