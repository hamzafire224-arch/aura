import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Instagram, Linkedin, Timer, Globe } from "lucide-react"

export interface PublishData {
    platforms: { instagram: boolean; tiktok: boolean; linkedin: boolean }
    caption: string
    schedule: 'now' | 'later' | 'best'
}

interface ScheduleSidebarProps {
    onPublish: (data: PublishData) => void
}

export function ScheduleSidebar({ onPublish }: ScheduleSidebarProps) {
    const [platforms, setPlatforms] = useState({ instagram: false, tiktok: false, linkedin: false })
    const [caption, setCaption] = useState('')
    const [schedule, setSchedule] = useState<'now' | 'later' | 'best'>('now')

    const handlePublish = () => {
        onPublish({ platforms, caption, schedule })
    }

    return (
        <div className="w-[300px] border-l border-white/10 bg-black/40 flex flex-col h-full">
            <div className="p-4 border-b border-white/10">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/20" onClick={handlePublish}>
                    <Share2 className="mr-2 h-4 w-4" /> Publish Now
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-6">
                {/* Channels Section */}
                <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Destinations</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-pink-600/20 rounded text-pink-500"><Instagram className="h-3.5 w-3.5" /></div>
                                <span className="text-sm">Instagram</span>
                            </div>
                            <Switch checked={platforms.instagram} onCheckedChange={(c) => setPlatforms(prev => ({ ...prev, instagram: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-black/20 rounded text-white"><span className="text-[10px] font-bold">TikTok</span></div>
                                <span className="text-sm">TikTok</span>
                            </div>
                            <Switch checked={platforms.tiktok} onCheckedChange={(c) => setPlatforms(prev => ({ ...prev, tiktok: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-600/20 rounded text-blue-500"><Linkedin className="h-3.5 w-3.5" /></div>
                                <span className="text-sm">LinkedIn</span>
                            </div>
                            <Switch checked={platforms.linkedin} onCheckedChange={(c) => setPlatforms(prev => ({ ...prev, linkedin: c }))} />
                        </div>
                    </div>
                </div>

                {/* Caption Section */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Caption</Label>
                        <Button variant="ghost" size="sm" className="h-5 text-[10px] text-emerald-400 p-0 hover:text-emerald-300">
                            ✨ AI Optimize
                        </Button>
                    </div>
                    <Textarea
                        placeholder="Write a caption..."
                        className="min-h-[120px] bg-white/5 border-white/10 text-sm resize-none focus-visible:ring-1"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <div className="text-[10px] text-right text-muted-foreground">{caption.length} / 2200</div>
                </div>

                {/* Scheduling Section */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schedule</h4>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <Select value={schedule} onValueChange={(val: 'now' | 'later' | 'best') => setSchedule(val)}>
                                <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0 px-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="now">Post Immediately</SelectItem>
                                    <SelectItem value="later">Schedule for Later</SelectItem>
                                    <SelectItem value="best">Best Time (AI)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>Target Timezone: GMT-5</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
