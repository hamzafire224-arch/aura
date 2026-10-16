import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts, type BlogPost, type BlogCategory } from "@/lib/blog-data"

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All")

    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter(post => {
            const matchesSearch = searchQuery === "" ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    const featuredPosts = getFeaturedPosts()

    return (
        <div className="min-h-screen bg-black text-white">
            {/* SEO Meta */}
            <title>Blog | AURA Increase - AI E-Commerce Insights</title>

            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero Header */}
                <section className="container mx-auto px-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                            <TrendingUp className="w-3 h-3 mr-1" /> Insights & Strategy
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            The AURA Blog
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            AI-powered insights for the next generation of e-commerce operators. Strategies, trends, and tactics that work.
                        </p>
                    </motion.div>
                </section>

                {/* Search & Filter */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 h-12"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap justify-center">
                            <Button
                                variant={selectedCategory === "All" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory("All")}
                                className={selectedCategory === "All" ? "" : "border-white/10 hover:bg-white/5"}
                            >
                                All
                            </Button>
                            {BLOG_CATEGORIES.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={selectedCategory === category ? "" : "border-white/10 hover:bg-white/5"}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Posts */}
                {searchQuery === "" && selectedCategory === "All" && (
                    <section className="container mx-auto px-4 mb-16">
                        <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredPosts.slice(0, 3).map((post, index) => (
                                <FeaturedCard key={post.slug} post={post} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Posts Grid */}
                <section className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {searchQuery || selectedCategory !== "All" ? "Results" : "Latest Articles"}
                        </h2>
                        <span className="text-muted-foreground text-sm">
                            {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No articles match your search.</p>
                            <Button
                                variant="ghost"
                                className="mt-4"
                                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post, index) => (
                                <ArticleCard key={post.slug} post={post} index={index} />
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 mt-24">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your E-Commerce?</h2>
                        <p className="text-muted-foreground mb-8">
                            Stop reading about AI-powered commerce. Start building it.
                        </p>
                        <Link to="/pricing">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Get Started with AURA <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function FeaturedCard({ post, index }: { post: BlogPost; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link to={`/blog/${post.slug}`}>
                <article className="group relative h-80 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <Badge className="w-fit mb-3 bg-white/10 text-white border-white/20">
                            {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime} min read
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    )
}

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
        >
            <Link to={`/blog/${post.slug}`}>
                <article className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all h-full flex flex-col">
                    <Badge variant="outline" className="w-fit mb-4 border-white/20 text-muted-foreground">
                        {post.category}
                    </Badge>

                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} min
                        </span>
                    </div>
                </article>
            </Link>
        </motion.div>
    )
}
