import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Copy, User } from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getBlogPost, getRelatedPosts, type BlogPost } from "@/lib/blog-data"

/**
 * Simple markdown-to-HTML converter for blog content
 * Handles: headers, bold, italic, links, lists, tables, hr, blockquotes, code
 */
function parseMarkdown(markdown: string): string {
    let html = markdown
        // Escape HTML (but keep our markdown patterns intact)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and Italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr />')
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Unordered lists
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // Paragraphs (double newlines)
        .replace(/\n\n/g, '</p><p>')
        // Single newlines in tables should be preserved
        .replace(/\n/g, '<br />')

    // Wrap in paragraphs
    html = '<p>' + html + '</p>'

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p><br \/><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6]>)/g, '$1')
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<hr \/>)/g, '$1')
    html = html.replace(/(<hr \/>)<\/p>/g, '$1')
    html = html.replace(/<p>(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li>.*?<\/li>)(<br \/>)?(<li>)/g, '$1$3')
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    html = html.replace(/<\/ul><ul>/g, '')

    // Handle tables (simplified)
    html = html.replace(/\|([^|]+)\|([^|]+)\|([^|]*)\|?/g, (_match, c1, c2, c3) => {
        if (c1.includes('---')) return '' // Skip separator row
        return `<tr><td>${c1.trim()}</td><td>${c2.trim()}</td>${c3 ? `<td>${c3.trim()}</td>` : ''}</tr>`
    })
    if (html.includes('<tr>')) {
        html = html.replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>')
    }

    return html
}

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const post = slug ? getBlogPost(slug) : undefined
    const relatedPosts = slug ? getRelatedPosts(slug, 3) : []

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <main className="pt-32 pb-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/blog")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Button>
                </main>
                <Footer />
            </div>
        )
    }

    const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
        const url = window.location.href
        const text = `${post.title} - AURA Blog`

        switch (platform) {
            case "twitter":
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
                break
            case "linkedin":
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
                break
            case "copy":
                navigator.clipboard.writeText(url)
                toast.success("Link copied to clipboard!")
                break
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* SEO Meta Tags */}
            <title>{post.title} | AURA Blog</title>
            <meta name="description" content={post.excerpt} />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.excerpt} />
            <meta property="og:type" content="article" />
            <meta name="twitter:card" content="summary_large_image" />

            <Navbar />

            <main className="pt-24 pb-20">
                {/* Back Button */}
                <div className="container mx-auto px-4 mb-8">
                    <Link to="/blog">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                        </Button>
                    </Link>
                </div>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 max-w-4xl mb-12"
                >
                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                        {post.category}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-white/10">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{post.author.name}</p>
                                <p className="text-xs text-muted-foreground">{post.author.role}</p>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime} min read
                            </span>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm text-muted-foreground mr-2">
                                <Share2 className="h-4 w-4 inline mr-1" /> Share
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-white/10"
                                onClick={() => handleShare("twitter")}
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-white/10"
                                onClick={() => handleShare("linkedin")}
                            >
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-white/10"
                                onClick={() => handleShare("copy")}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </motion.header>

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="container mx-auto px-4 max-w-4xl"
                >
                    <div className="prose prose-invert prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white
                        prose-ul:text-gray-300 prose-ol:text-gray-300
                        prose-li:marker:text-primary
                        prose-hr:border-white/10
                        prose-blockquote:border-l-primary prose-blockquote:text-gray-400
                        prose-table:border prose-table:border-white/10
                        prose-th:bg-white/5 prose-th:p-3 prose-th:text-left
                        prose-td:p-3 prose-td:border-t prose-td:border-white/10
                        prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary
                        prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
                    ">
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
                    </div>

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h4 className="text-sm font-medium text-muted-foreground mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="border-white/20 text-muted-foreground">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </motion.article>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <section className="container mx-auto px-4 mt-20">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map(related => (
                                    <RelatedCard key={related.slug} post={related} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="container mx-auto px-4 mt-20">
                    <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
                        <h2 className="text-3xl font-bold mb-4">Ready to Apply These Insights?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            AURA's AI agents help you implement these strategies at scale. Stop reading, start doing.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/pricing">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/blog">
                                <Button size="lg" variant="outline" className="border-white/20">
                                    More Articles
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function RelatedCard({ post }: { post: BlogPost }) {
    return (
        <Link to={`/blog/${post.slug}`}>
            <article className="group p-5 rounded-xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all h-full flex flex-col">
                <Badge variant="outline" className="w-fit mb-3 border-white/20 text-muted-foreground text-xs">
                    {post.category}
                </Badge>

                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                    </span>
                </div>
            </article>
        </Link>
    )
}
