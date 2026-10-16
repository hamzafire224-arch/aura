import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldAlert, KeyRound, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const passwordSchema = z.object({
    password: z.string().min(6, "Minimum 6 characters"),
    confirm: z.string().min(6)
}).refine(data => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"]
})

export function SecurityVault() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(passwordSchema)
    })

    const onUpdatePassword = async (data: any) => {
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password })
            if (error) throw error
            toast.success("Security Protocols Updated")
            reset()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleNuclearOption = async () => {
        if (deleteConfirmText !== "DELETE") return
        setIsDeleting(true)
        // Simulated deletion
        setTimeout(() => {
            toast.error("Security Override: Deletion Sequence Initiated (Simulation)")
            setIsDeleting(false)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-pink-400" /> Security Protocols
                    </CardTitle>
                    <CardDescription>Encryption keys and access control.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onUpdatePassword)} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label>New Encryption Key (Password)</Label>
                            <Input type="password" {...register("password")} className="bg-black/20 border-white/10" />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Key</Label>
                            <Input type="password" {...register("confirm")} className="bg-black/20 border-white/10" />
                        </div>
                        <Button type="submit" disabled={isSubmitting} variant="outline" className="border-pink-500/20 hover:bg-pink-500/10 hover:text-pink-400">
                            Update Keys
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5 backdrop-blur-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                        <ShieldAlert className="h-5 w-5" /> Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Wipe Identity</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete account and all associated data artifacts.</p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20">
                                Initiate Wipe
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0B0E14] border-red-500/30 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-red-500 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Nuclear Warning
                                </DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    This action cannot be undone. All agents, wealth data, and content strategies will be incinerated.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Label>Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm</Label>
                                <Input
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="bg-red-950/20 border-red-500/30 text-red-400 font-mono"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    disabled={deleteConfirmText !== "DELETE" || isDeleting}
                                    onClick={handleNuclearOption}
                                >
                                    {isDeleting ? "Wiping..." : "Confirm Deletion"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}
