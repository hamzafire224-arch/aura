import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useBusiness } from "@/contexts/BusinessContext"
import { Loader2, AlertCircle, Store, Key, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ImportWizard() {
    const { importBusiness, isLoading } = useBusiness()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [platform, setPlatform] = useState("")
    const [url, setUrl] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleConnect = async () => {
        setError(null)

        // Basic Validation
        if (!url) {
            setError("Store URL is required")
            return
        }
        if (!apiKey) {
            setError("API Access Token is required")
            return
        }

        try {
            // In a real app, we might verify here first, but for now we'll simulate the "Authorize" step
            // by moving to step 3, where the actual import happens on confirmation.
            // However, to be "strict", let's verify credentials *now* before asking for permission.
            await importBusiness(platform, { url, accessToken: apiKey, apiKey })
            setStep(4) // Skip to success directly for now, or we could add a confirmation step.
        } catch (err: any) {
            setError(err.message || "Failed to connect to store")
        }
    }

    const reset = () => {
        setStep(1)
        setPlatform("")
        setUrl("")
        setApiKey("")
        setError(null)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Store className="h-4 w-4" /> Import Business
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Existing Business</DialogTitle>
                    <DialogDescription>
                        Connect your existing store to AURA for centralized management.
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="py-4 space-y-4"
                        >
                            <div className="space-y-2">
                                <Label>Select Platform</Label>
                                <Select onValueChange={(val) => { setPlatform(val); setStep(2); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Shopify">Shopify</SelectItem>
                                        <SelectItem value="Wix">Wix</SelectItem>
                                        <SelectItem value="WordPress" disabled>WordPress (Coming Soon)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="py-4 space-y-4"
                        >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span className="font-medium text-foreground">{platform}</span>
                                <span>&gt;</span>
                                <span>Connect API</span>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label>Store URL</Label>
                                    <Input
                                        placeholder={platform === 'Shopify' ? "your-store.myshopify.com" : "https://your-site.wixsite.com"}
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>{platform === 'Shopify' ? 'Admin API Access Token' : 'API Key'}</Label>
                                    <div className="relative">
                                        <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="shpat_..."
                                            className="pl-9"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
                                </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                                        </>
                                    ) : (
                                        "Connect Store"
                                    )}
                                </Button>
                            </DialogFooter>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center space-y-4 py-8"
                        >
                            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                <Check className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-500">Success!</h3>
                            <p className="text-muted-foreground">
                                <strong>{url}</strong> has been successfully connected to AURA.
                            </p>
                            <Button onClick={reset} className="w-full mt-6">
                                Go to Dashboard
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
