import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { LearningService, type Course, type Lesson } from "@/lib/learning-service"
import { ArrowLeft, CheckCircle, PlayCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

export default function CoursePlayer() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course | null>(null)
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) loadCourse(slug)
    }, [slug])

    async function loadCourse(courseSlug: string) {
        try {
            const data = await LearningService.getCourseBySlug(courseSlug)
            setCourse(data)

            // Default to first lesson if available
            if (data.modules?.[0]?.lessons?.[0]) {
                setActiveLesson(data.modules[0].lessons[0])
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load course")
            navigate("/dashboard/learning")
        } finally {
            setLoading(false)
        }
    }

    if (loading || !course) {
        return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    const handleLessonSelect = (lesson: Lesson) => {
        setActiveLesson(lesson)
        // TODO: Mark as started
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar (Modules) */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-card/50">
                <div className="p-4 border-b border-white/10">
                    <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate("/dashboard/learning")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
                    </Button>
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {course.modules?.map((module, i) => (
                            <div key={module.id} className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Module {i + 1}: {module.title}
                                </div>
                                <div className="space-y-1">
                                    {module.lessons?.map((lesson) => {
                                        const isActive = activeLesson?.id === lesson.id
                                        const isCompleted = lesson.user_progress?.[0]?.completed || false

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleLessonSelect(lesson)}
                                                className={`w-full flex items-start text-left gap-3 p-2 rounded-lg text-sm transition-colors ${isActive
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                                                ) : (
                                                    <PlayCircle className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? "fill-primary/20" : ""}`} />
                                                )}
                                                <span className="line-clamp-2">{lesson.title}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Course Progress</span>
                        <span>0%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%]" />
                    </div>
                </div>
            </div>

            {/* Main Content (Player) */}
            <div className="flex-1 flex flex-col bg-black">
                <div className="flex-1 flex items-center justify-center p-8">
                    {activeLesson ? (
                        <div className="w-full max-w-4xl aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl relative">
                            <iframe
                                src={activeLesson.video_url}
                                title={activeLesson.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            Select a lesson to start watching
                        </div>
                    )}
                </div>

                {activeLesson && (
                    <div className="p-8 border-t border-white/10 bg-background">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{activeLesson.title}</h1>
                                <p className="text-muted-foreground text-sm">Lesson {activeLesson.order_index}</p>
                            </div>
                            <Button
                                onClick={() => LearningService.updateProgress(activeLesson.id, true, 0)}
                                variant="secondary"
                            >
                                Mark as Complete
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
