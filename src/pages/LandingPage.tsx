import HeroSection from "@/components/landing/HeroSection"
import Navbar from "@/components/landing/Navbar"
import ProblemSolutionSection from "@/components/landing/ProblemSolutionSection"
import PillarsSection from "@/components/landing/PillarsSection"
import PricingSection from "@/components/landing/PricingSection"
import ReviewsSection from "@/components/landing/ReviewsSection"
import FAQSection from "@/components/landing/FAQSection"
import CTASection from "@/components/landing/CTASection"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            <main>
                <HeroSection />
                <ProblemSolutionSection />
                <PillarsSection />
                <ReviewsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    )
}
