import { Suspense, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import { Loader2 } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { BusinessProvider } from "@/contexts/BusinessContext"
import { IntegrationProvider } from "@/contexts/IntegrationContext"
import { WorkflowProvider } from "@/contexts/WorkflowContext"
import { ErrorBoundary } from "@/components/ui/error-boundary"

// Auth Guard & Layout
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import VoidLayout from "@/layouts/VoidLayout"

// Protected Dashboard Views
import Dashboard from "@/pages/Dashboard"
import { KanbanBoard } from "@/components/dashboard/workflows/KanbanBoard"
import { CompetitorReport } from "@/components/dashboard/spy/CompetitorReport"
import Treasury from "@/pages/Treasury"

// Public Pages
import FeaturesPage from "@/pages/FeaturesPage"
import PricingPage from "@/pages/PricingPage"
import BlogPage from "@/pages/BlogPage"
import BlogPostPage from "@/pages/BlogPostPage"

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"

// Company Pages
import AboutPage from "@/pages/company/AboutPage"
import ContactPage from "@/pages/company/ContactPage"
import CareersPage from "@/pages/company/CareersPage"
import ResultsPage from "@/pages/company/ResultsPage"

// Feature Pages
import ContentStudioPage from "@/pages/features/ContentStudioPage"
import BusinessWizardPage from "@/pages/features/BusinessWizardPage"
import FinancialHubPage from "@/pages/features/FinancialHubPage"
import AffiliateSystemPage from "@/pages/features/AffiliateSystemPage"
import AdOptimizationPage from "@/pages/features/AdOptimizationPage"
import MarketIntelligencePage from "@/pages/features/MarketIntelligencePage"
import SalesAutopilotPage from "@/pages/features/SalesAutopilotPage"

// Resources Pages
import RoadmapPage from "@/pages/resources/RoadmapPage"
import ApiDocsPage from "@/pages/resources/ApiDocsPage"

// Legal Pages
import TermsPage from "@/pages/legal/TermsPage"
import PrivacyPage from "@/pages/legal/PrivacyPage"
import CookiePage from "@/pages/legal/CookiePage"
import SecurityPage from "@/pages/legal/SecurityPage"

import { scheduler } from "@/lib/services/scheduler"
import { TrafficMonitor } from "@/components/void/TrafficMonitor"

function App() {
  useEffect(() => {
    scheduler.start()
    return () => scheduler.stop()
  }, [])

  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <AuthProvider>
        <IntegrationProvider>
          <BusinessProvider>
            <WorkflowProvider>
              <ErrorBoundary>
                <Routes>
                  {/* Public Marketing Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />

                  {/* Public Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Protected Command Center (Void / Dashboard) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<VoidLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="workflows" element={<KanbanBoard />} />
                      <Route path="spy" element={<CompetitorReport />} />
                      <Route path="treasury" element={<Treasury />} />
                    </Route>

                    {/* Void Aliases / Backwards Compatibility Redirects */}
                    <Route path="/void" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/void/nexus" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/void/genesis" element={<Navigate to="/dashboard/workflows" replace />} />
                    <Route path="/void/council" element={<Navigate to="/dashboard/workflows" replace />} />
                    <Route path="/void/treasury" element={<Navigate to="/dashboard/treasury" replace />} />
                    <Route path="/void/sanctum" element={<Navigate to="/dashboard" replace />} />
                  </Route>

                  {/* Company Routes */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/results" element={<ResultsPage />} />

                  {/* Feature Demo & Marketing Routes */}
                  <Route path="/features/content-studio" element={<ContentStudioPage />} />
                  <Route path="/features/business-wizard" element={<BusinessWizardPage />} />
                  <Route path="/features/financial-hub" element={<FinancialHubPage />} />
                  <Route path="/features/affiliate-system" element={<AffiliateSystemPage />} />
                  <Route path="/features/ad-optimization" element={<AdOptimizationPage />} />
                  <Route path="/features/market-intelligence" element={<MarketIntelligencePage />} />
                  <Route path="/features/sales-autopilot" element={<SalesAutopilotPage />} />

                  {/* Resources Routes */}
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/api-docs" element={<ApiDocsPage />} />
                  <Route path="/workflows" element={<SalesAutopilotPage />} />

                  {/* Legal Routes */}
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiePage />} />
                  <Route path="/security" element={<SecurityPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* INVISIBLE TRACKERS */}
                <TrafficMonitor />
              </ErrorBoundary>
              <Toaster />
            </WorkflowProvider>
          </BusinessProvider>
        </IntegrationProvider>
      </AuthProvider>
    </Suspense>
  )
}

export default App
