import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, ChevronLeft, Wand2, RefreshCw, LayoutTemplate, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

interface CanvasStageProps {
    activeProject: any
    onUpdateProject: (updates: any) => void
    isGenerating: boolean
}

export function CanvasStage({ activeProject, onUpdateProject, isGenerating }: CanvasStageProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(15) // Default 15 seconds
    const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">("9:16")

    const videoRef = useRef<HTMLVideoElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Sync play/pause with video element
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(() => setIsPlaying(false))
            } else {
                videoRef.current.pause()
            }
        }
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => { })
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    // Update mute state
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = isMuted
        if (audioRef.current) audioRef.current.muted = isMuted
    }, [isMuted])

    // Track video time
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleMagicEdit = () => {
        if (!activeProject) return
        onUpdateProject({ ...activeProject, edited: true, lastEditedAt: new Date().toISOString() })
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const isVideoContent = activeProject?.videoUrl || activeProject?.previewUrl?.includes('.mp4')

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950 relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/40 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                        {activeProject?.title || "Untitled Project"}
                    </span>
                    <Badge variant="outline" className="text-[10px] ml-2 border-white/10">
                        {activeProject?.status || "Draft"}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-md border border-white/10">
                    {["9:16", "1:1", "16:9"].map((ratio) => (
                        <Button
                            key={ratio}
                            variant={aspectRatio === ratio ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setAspectRatio(ratio as any)}
                            className="h-6 text-[10px] px-2"
                        >
                            {ratio}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-8 w-8 p-0"
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        disabled={isGenerating || !activeProject}
                        size="sm"
                        onClick={handleMagicEdit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                        {isGenerating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                        Magic Edit
                    </Button>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-dots-pattern relative">
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative bg-black border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out
                        ${aspectRatio === '9:16' ? 'aspect-[9/16] h-full max-h-[600px]' : ''}
                        ${aspectRatio === '1:1' ? 'aspect-square h-full max-h-[600px]' : ''}
                        ${aspectRatio === '16:9' ? 'aspect-video w-full max-w-[800px]' : ''}
                    `}
                >
                    {activeProject ? (
                        <div className="w-full h-full relative group">
                            {/* Video or Image Content */}
                            {isVideoContent ? (
                                <video
                                    ref={videoRef}
                                    src={activeProject.videoUrl || activeProject.previewUrl}
                                    className="w-full h-full object-cover"
                                    loop
                                    playsInline
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={() => setIsPlaying(false)}
                                />
                            ) : (
                                <img
                                    src={activeProject.previewUrl || activeProject.imageUrl || "/placeholder-content.jpg"}
                                    className="w-full h-full object-cover opacity-90"
                                    alt="Canvas Content"
                                />
                            )}

                            {/* Audio Track (if separate) */}
                            {activeProject.audioUrl && (
                                <audio ref={audioRef} src={activeProject.audioUrl} loop />
                            )}

                            {/* Play/Pause Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white border-2 border-white/50"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
                                </Button>
                            </div>

                            {/* Caption Overlay */}
                            {activeProject.caption && (
                                <div className="absolute bottom-10 left-4 right-4 text-center">
                                    <p className="text-white font-bold text-shadow-sm px-4 py-2 bg-black/40 backdrop-blur rounded-lg inline-block">
                                        {activeProject.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <LayoutTemplate className="h-12 w-12 opacity-20" />
                            <p className="text-sm">Select a template or asset to start</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Bottom Timeline */}
            <div className="h-16 border-t border-white/10 bg-black/40 flex items-center px-4 gap-4">
                <div className="text-xs font-mono text-muted-foreground">{formatTime(currentTime)}</div>
                <div
                    className="flex-1 h-8 bg-white/5 rounded mx-2 relative overflow-hidden cursor-pointer group"
                    onClick={(e) => {
                        if (videoRef.current && duration) {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const clickX = e.clientX - rect.left
                            const newTime = (clickX / rect.width) * duration
                            videoRef.current.currentTime = newTime
                            setCurrentTime(newTime)
                        }
                    }}
                >
                    {/* Progress Bar */}
                    <div
                        className="absolute top-0 bottom-0 left-0 bg-primary/30"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Playhead */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_10px_red]"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>
                <div className="text-xs font-mono text-muted-foreground">{formatTime(duration)}</div>
            </div>
        </div>
    )
}

