import { supabase } from "./supabase"

export type Course = {
    id: string
    title: string
    description: string
    thumbnail_url: string
    slug: string
    category: string
    level: string
    modules?: Module[]
    created_at: string
}

export type Module = {
    id: string
    title: string
    order_index: number
    lessons?: Lesson[]
}

export type Lesson = {
    id: string
    title: string
    video_url: string
    duration: number
    order_index: number
    user_progress?: {
        completed: boolean
        last_position: number
    }[]
}

export const LearningService = {
    async getCheckList() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('published', true)

        if (error) throw error
        return data as Course[]
    },

    async getCourseBySlug(slug: string) {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules (
                    *,
                    lessons (
                        *,
                        user_progress (
                            completed,
                            last_position
                        )
                    )
                )
            `)
            .eq('slug', slug)
            .single()

        if (error) throw error

        // Sort modules and lessons
        if (data && data.modules) {
            data.modules.sort((a: any, b: any) => a.order_index - b.order_index)
            data.modules.forEach((m: any) => {
                if (m.lessons) {
                    m.lessons.sort((a: any, b: any) => a.order_index - b.order_index)
                }
            })
        }

        return data as Course
    },

    async updateProgress(lessonId: string, completed: boolean, position: number) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No authenticated user')

        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                lesson_id: lessonId,
                completed,
                last_position: position,
                updated_at: new Date().toISOString()
            })

        if (error) throw error
    }
}
