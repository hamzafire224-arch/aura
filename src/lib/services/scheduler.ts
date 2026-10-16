import { toast } from "sonner"

export interface ScheduledJob {
    id: string
    content: string
    platforms: string[]
    scheduledTime: number // Timestamp
    status: 'pending' | 'published' | 'failed'
}

const STORAGE_KEY = 'aura_scheduled_jobs'
const INTERVAL_MS = 30000 // Check every 30s

export class SchedulerService {
    private intervalId: any = null

    start() {
        if (this.intervalId) return
        console.log("[Scheduler] " + "Ghost Engine Initialized. Watching for jobs...")
        this.intervalId = setInterval(() => this.checkQueue(), INTERVAL_MS)
    }

    stop() {
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = null
    }

    schedule(job: Omit<ScheduledJob, 'status'>) {
        const jobs = this.getJobs()
        jobs.push({ ...job, status: 'pending' })
        this.saveJobs(jobs)
        console.log(`[Scheduler] Job ${job.id} scheduled for ${new Date(job.scheduledTime).toLocaleString()}`)
    }

    private checkQueue() {
        const now = Date.now()
        const jobs = this.getJobs()
        let hasUpdates = false

        jobs.forEach(job => {
            if (job.status === 'pending' && job.scheduledTime <= now) {
                // Time to publish!
                this.publish(job)
                job.status = 'published'
                hasUpdates = true
            }
        })

        if (hasUpdates) this.saveJobs(jobs)
    }

    private publish(job: ScheduledJob) {
        console.log(`[Scheduler] value publishing job ${job.id}`)
        // In a real app, this would call the API
        // Here we simulate the "Ghost" working
        toast.success(`Auto-Published to ${job.platforms.join(", ")}`, {
            description: `"${job.content.substring(0, 30)}..." is now live.`
        })
    }

    private getJobs(): ScheduledJob[] {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch {
            return []
        }
    }

    private saveJobs(jobs: ScheduledJob[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
    }
}

export const scheduler = new SchedulerService()
