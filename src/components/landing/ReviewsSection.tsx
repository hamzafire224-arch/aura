import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reviews = [
    {
        name: "Alex Rivera",
        role: "Founder, TechFlow",
        content: "AURA didn't just automate my business; it reinvented it. The financial hub alone saved me 20 hours a week.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Sarah Chen",
        role: "CEO, EcoStyle",
        content: "I was skeptical about AI content generation, but the Content Studio is indistinguishable from human writing. Absolutely game-changing.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Marcus Johnson",
        role: "Director, CreativePulse",
        content: "The Business Wizard helped us launch a new vertical in 48 hours. The speed of execution with AURA is unmatched.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Elena Rodriguez",
        role: "Freelance Designer",
        content: "As a solopreneur, AURA acts as my entire back office. I can focus on design while it handles the invoices.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 4
    },
    {
        name: "David Kim",
        role: "Marketing Lead",
        content: "The affiliate tracking is robust. We scaled our ambassador program to 500+ people without a single hiccup.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Jessica Lee",
        role: "Blogger",
        content: "Content Studio is a lifesaver. It generates ideas when I have writer's block and drafts are 90% there.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 4
    },
    {
        name: "Michael Chang",
        role: "E-com Store Owner",
        content: "Financial Hub caught a recurring subscription I forgot about. Paid for itself in the first month.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Priya Patel",
        role: "Startup Founder",
        content: "We used Business Wizard to validate our pivot. Saved us months of wasted development time.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 5
    },
    {
        name: "Tom Baker",
        role: "Agency Owner",
        content: "Good tool, but the real value is in the integration. Everything talks to everything else.",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&auto=format&fit=crop&q=60",
        rating: 4
    }
]

export default function ReviewsSection() {
    return (
        <section className="py-24 bg-black/40 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4"
                    >
                        <Star className="mr-2 h-3.5 w-3.5 fill-current" />
                        Trusted by 1,200+ Founders
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        Don't Just Take Our Word For It.
                    </motion.h2>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="break-inside-avoid relative group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-[1.02]"
                        >
                            <Quote className="absolute top-8 right-8 h-8 w-8 text-white/5 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, starIndex) => (
                                    <Star
                                        key={starIndex}
                                        className={`h-4 w-4 ${starIndex < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/20"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={review.avatar} alt={`Avatar of ${review.name}`} />
                                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-white text-sm">{review.name}</div>
                                    <div className="text-xs text-muted-foreground">{review.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
