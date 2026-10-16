import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { StoreTheme } from "@/lib/ai/store-builder"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditThemeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    theme: StoreTheme | null
    onSave: (theme: StoreTheme) => void
}

export function EditThemeDialog({ open, onOpenChange, theme, onSave }: EditThemeDialogProps) {
    const [localTheme, setLocalTheme] = useState<StoreTheme | null>(theme)

    useEffect(() => {
        setLocalTheme(theme)
    }, [theme])

    if (!localTheme) return null

    const handleSave = () => {
        if (localTheme) {
            onSave(localTheme)
            onOpenChange(false)
        }
    }

    const updateContent = (field: keyof StoreTheme['content'], value: string) => {
        setLocalTheme(prev => prev ? {
            ...prev,
            content: { ...prev.content, [field]: value }
        } : null)
    }

    const updateColor = (field: keyof StoreTheme['colors'], value: string) => {
        setLocalTheme(prev => prev ? {
            ...prev,
            colors: { ...prev.colors, [field]: value }
        } : null)
    }

    const toggleFeature = (field: keyof NonNullable<StoreTheme['features']>) => {
        setLocalTheme(prev => {
            if (!prev) return null
            const features = prev.features || {}
            return {
                ...prev,
                features: {
                    ...features,
                    [field]: !features[field]
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-black/90 border-white/10 text-white max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Strategy Configuration</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Core Identity */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-widest">Core Messaging</h4>

                        <div className="grid gap-2">
                            <Label>Hero Headline (H1)</Label>
                            <Input
                                value={localTheme.content.heroHeadline}
                                onChange={(e) => updateContent('heroHeadline', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Subheadline</Label>
                            <Textarea
                                value={localTheme.content.heroSubhead}
                                onChange={(e) => updateContent('heroSubhead', e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>CTA Button Text</Label>
                                <Input
                                    value={localTheme.content.ctaText}
                                    onChange={(e) => updateContent('ctaText', e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Trust Badge</Label>
                                <Input
                                    value={localTheme.content.trustBadge}
                                    onChange={(e) => updateContent('trustBadge', e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visual System */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="text-sm font-medium text-purple-400 uppercase tracking-widest">Visual System</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Layout Architecture</Label>
                                <Select
                                    value={localTheme.layout}
                                    onValueChange={(val: any) => setLocalTheme(prev => prev ? { ...prev, layout: val } : null)}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="minimal">Minimal</SelectItem>
                                        <SelectItem value="bold">Bold</SelectItem>
                                        <SelectItem value="editorial">Editorial</SelectItem>
                                        <SelectItem value="industrial">Industrial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Primary Color (Hex)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={localTheme.colors.primary}
                                        onChange={(e) => updateColor('primary', e.target.value)}
                                        className="bg-white/5 border-white/10 text-white font-mono"
                                    />
                                    <div className="h-10 w-10 rounded border border-white/20 shrink-0" style={{ background: localTheme.colors.primary }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="text-sm font-medium text-amber-400 uppercase tracking-widest">Active Protocols</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <Label>Scarcity Timer (Hype)</Label>
                                <Switch
                                    checked={localTheme.features?.scarcityTimer || false}
                                    onCheckedChange={() => toggleFeature('scarcityTimer')}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <Label>Social Proof Wall</Label>
                                <Switch
                                    checked={localTheme.features?.socialProof || false}
                                    onCheckedChange={() => toggleFeature('socialProof')}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <Label>Trust Badge Grid</Label>
                                <Switch
                                    checked={localTheme.features?.trustBadges || false}
                                    onCheckedChange={() => toggleFeature('trustBadges')}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <Label>Comparison Table</Label>
                                <Switch
                                    checked={localTheme.features?.comparison || false}
                                    onCheckedChange={() => toggleFeature('comparison')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                        Confirm Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
