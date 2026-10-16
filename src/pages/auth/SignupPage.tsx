import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    plan: z.enum(["free", "pro", "enterprise"]),
    terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

const plans = [
    {
        id: "free",
        name: "Starter",
        price: "$0",
        description: "For lead generation & viral growth",
        features: ["1 Business", "10 AI Credits/mo", "Basic Support"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$49",
        description: "For serious solopreneurs",
        features: ["5 Businesses", "500 AI Credits/mo", "Priority Support"],
        popular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "$149",
        description: "For growing agencies",
        features: ["Unlimited Businesses", "Unlimited AI", "White-label"],
    },
]

export default function SignupPage() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState("free")
    const [showPassword, setShowPassword] = useState(false)

    const [inputCode, setInputCode] = useState("")
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const defaultEmail = searchParams.get("email") || ""

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: "",
            email: defaultEmail,
            password: "",
            confirmPassword: "",
            plan: "free",
            terms: false,
        },
    })

    const password = form.watch("password")

    const getPasswordStrength = (pass: string) => {
        let strength = 0
        if (pass.length >= 8) strength += 25
        if (/[A-Z]/.test(pass)) strength += 25
        if (/[0-9]/.test(pass)) strength += 25
        if (/[^A-Za-z0-9]/.test(pass)) strength += 25
        return strength
    }

    const passwordStrength = getPasswordStrength(password || "")

    async function sendVerificationCode() {
        // Validate Step 1 fields first
        const isValid = await form.trigger(["fullName", "email", "password", "confirmPassword"])
        if (!isValid) return

        const email = form.getValues("email")
        if (!email) return

        setIsLoading(true)

        try {
            const { error } = await supabase.functions.invoke('auth-otp', {
                body: { action: 'send', email }
            })

            if (error) {
                // If it's a known error shape
                throw error
            }

            setStep(1.5) // Intermediate step for OTP
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to send verification code")
        } finally {
            setIsLoading(false)
        }
    }


    async function verifyCode() {
        const email = form.getValues("email")
        setIsLoading(true)

        try {
            const { data, error } = await supabase.functions.invoke('auth-otp', {
                body: { action: 'verify', email, code: inputCode }
            })

            if (error) throw error

            if (data.success && data.valid) {
                setIsEmailVerified(true)
                setStep(2)
            } else {
                throw new Error("Invalid code")
            }
        } catch (error: any) {
            toast.error(error.message || "Invalid code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    async function onSubmit(data: SignupFormValues) {
        if (!isEmailVerified) {
            toast.error("Please verify your email first.")
            return
        }

        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        plan: data.plan,
                    }
                }
            })

            if (error) throw error

            // Show success message
            setStep(3) // Final success
        } catch (error: any) {
            console.error(error)
            let msg = error.message || "Failed to sign up"
            if (msg.includes("already registered")) msg = "An account with this email already exists."
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const prevStep = () => setStep(step - 1)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="space-y-1 px-0">
                    {step < 3 && (
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Step {Math.floor(step)} of 2</span>
                            <div className="flex gap-1">
                                <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
                                <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
                            </div>
                        </div>
                    )}
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        {step === 3 ? "Welcome to AURA" : "Create an account"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 ? "Enter your details to get started" : step === 2 ? "Choose the plan that fits your needs" : "Your account has been successfully created"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} />
                                        {form.formState.errors.fullName && (
                                            <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="name@example.com" {...form.register("email")} />
                                        {form.formState.errors.email && (
                                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                className="pr-9"
                                                {...form.register("password")}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                        {/* Password Strength Meter */}
                                        {password && (
                                            <div className="space-y-1">
                                                <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-muted">
                                                    <div className={cn("h-full transition-all duration-500", passwordStrength >= 25 ? "bg-red-500" : "bg-transparent")} style={{ width: "25%" }} />
                                                    <div className={cn("h-full transition-all duration-500", passwordStrength >= 50 ? "bg-orange-500" : "bg-transparent")} style={{ width: "25%" }} />
                                                    <div className={cn("h-full transition-all duration-500", passwordStrength >= 75 ? "bg-yellow-500" : "bg-transparent")} style={{ width: "25%" }} />
                                                    <div className={cn("h-full transition-all duration-500", passwordStrength >= 100 ? "bg-green-500" : "bg-transparent")} style={{ width: "25%" }} />
                                                </div>
                                                <p className="text-xs text-muted-foreground text-right">
                                                    {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                                                </p>
                                            </div>
                                        )}
                                        {form.formState.errors.password && (
                                            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
                                        {form.formState.errors.confirmPassword && (
                                            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <Button type="button" onClick={sendVerificationCode} className="w-full">
                                        Verify Email <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 1.5 && (
                                <motion.div
                                    key="step1.5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2 text-center">
                                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Loader2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Verify your email</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We sent a code to <strong>{form.getValues("email")}</strong>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Verification Code</Label>
                                        <Input
                                            placeholder="123456"
                                            className="text-center text-lg tracking-widest"
                                            value={inputCode}
                                            onChange={(e) => setInputCode(e.target.value)}
                                            maxLength={6}
                                        />
                                    </div>

                                    <Button type="button" onClick={verifyCode} className="w-full" disabled={inputCode.length !== 6}>
                                        Confirm Code
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-full">
                                        Change Email
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid gap-4">
                                        {plans.map((plan) => (
                                            <div
                                                key={plan.id}
                                                className={cn(
                                                    "relative flex cursor-pointer flex-col rounded-lg border p-4 shadow-sm outline-none transition-all hover:border-primary",
                                                    selectedPlan === plan.id ? "border-primary ring-1 ring-primary" : "border-border"
                                                )}
                                                onClick={() => {
                                                    setSelectedPlan(plan.id)
                                                    form.setValue("plan", plan.id as any)
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">{plan.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-bold">{plan.price}</span>
                                                        <span className="text-sm text-muted-foreground">/mo</span>
                                                    </div>
                                                </div>
                                                {plan.popular && (
                                                    <div className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                                        Most Popular
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-start space-x-2 pt-2 pb-2">
                                        <Checkbox
                                            id="terms"
                                            checked={form.watch("terms")}
                                            onCheckedChange={(checked: boolean) => form.setValue("terms", checked)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                I accept the terms and conditions
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                                            </p>
                                        </div>
                                    </div>
                                    {form.formState.errors.terms && (
                                        <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
                                    )}

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={prevStep} className="w-1/3">
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button type="submit" disabled={isLoading} className="w-2/3">
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Account
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center text-center space-y-4 py-4"
                                >
                                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Account Created! 🚀</h3>
                                    <p className="text-muted-foreground max-w-sm">
                                        We've sent a verification link to <strong>{form.getValues("email")}</strong>.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Please click the link in your email to activate your account.
                                    </p>
                                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/login")}>
                                        Back to Login
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>
                <CardFooter className="px-0">
                    {step !== 3 && (
                        <p className="text-center text-sm text-muted-foreground w-full">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    )
}
