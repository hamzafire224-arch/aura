import { useState, useRef, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Sparkles, Camera } from "lucide-react"

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function IdentityCard() {
    const { user } = useAuth()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.user_metadata?.full_name || "",
            title: user?.user_metadata?.title || "Commander"
        }
    })

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size limit is 2MB.")
            return
        }

        try {
            setIsUploading(true)
            const fileExt = file.name.split('.').pop()?.toLowerCase()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                // If bucket doesn't exist, provide helpful error
                if (uploadError.message.includes('not found')) {
                    toast.error("Avatar storage not configured. Contact support.")
                    console.error("Missing 'avatars' bucket in Supabase Storage")
                    return
                }
                throw uploadError
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update user metadata with new avatar URL
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            if (updateError) throw updateError

            toast.success("Avatar Identity Updated")

        } catch (error: any) {
            console.error("Avatar upload failed:", error)
            toast.error(error.message || "Upload failed")
        } finally {
            setIsUploading(false)
        }
    }

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: data.fullName, title: data.title }
            })
            if (error) throw error
            toast.success("Identity Records Updated")
        } catch (error: any) {
            toast.error("Update failed")
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* AVATAR SECTION */}
            <Card className="col-span-1 border-white/10 bg-white/5 backdrop-blur-xl h-fit">
                <CardContent className="pt-6 flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 opacity-20 group-hover:opacity-40 transition-opacity blur-xl" />
                        <Avatar className="h-32 w-32 border-2 border-white/10 group-hover:border-pink-500/50 transition-colors">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-slate-900 text-slate-400 text-3xl">
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-medium text-white">{user?.user_metadata?.full_name || "Unknown Agent"}</h3>
                        <Badge variant="outline" className="border-pink-500/20 text-pink-400 bg-pink-500/5">
                            {user?.user_metadata?.title || "Commander"}
                        </Badge>
                    </div>

                    <div className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Upload New
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* DETAILS SECTION */}
            <Card className="col-span-1 md:col-span-2 border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Identity Records</CardTitle>
                    <CardDescription>Your command profile details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input {...register("fullName")} className="bg-black/20 border-white/10" />
                            {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Rank / Title</Label>
                            <Input {...register("title")} className="bg-black/20 border-white/10" placeholder="e.g. Founder, CEO" />
                        </div>

                        <div className="space-y-2 opacity-50 pointer-events-none">
                            <Label>System Email</Label>
                            <div className="flex gap-2">
                                <Input value={user?.email} readOnly className="bg-black/20 border-white/10" />
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Verified</Badge>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="bg-pink-600 hover:bg-pink-700">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Save Identity
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
