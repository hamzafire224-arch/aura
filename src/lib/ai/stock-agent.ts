const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || ""

export type StockVideo = {
    id: number
    width: number
    height: number
    duration: number
    image: string // Thumbnail
    videoFile: string // MP4 URL
    url: string // Pexels Page
    user: {
        name: string
        url: string
    }
}

export class StockAgent {
    private baseUrl = "https://api.pexels.com/videos"

    async searchVideos(query: string, orientation: 'portrait' | 'landscape' = 'portrait'): Promise<StockVideo[]> {
        if (!PEXELS_API_KEY) {
            throw new Error("Stock video features require Pexels API Key. Please configure VITE_PEXELS_API_KEY in your environment.")
        }

        try {
            const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=5`, {
                headers: {
                    "Authorization": PEXELS_API_KEY
                }
            })

            if (!response.ok) {
                const errorBody = await response.text()
                throw new Error(`Pexels API Error: ${response.status} ${response.statusText} - ${errorBody}`)
            }

            const data = await response.json()

            if (!data.videos) return []

            return data.videos.map((v: any) => {
                const videoFiles = Array.isArray(v.video_files) ? v.video_files : []
                const videoFile = videoFiles.find((f: any) => f.quality === 'hd' || f.quality === 'sd')?.link || videoFiles[0]?.link || ""

                return {
                    id: v.id,
                    width: v.width,
                    height: v.height,
                    duration: v.duration,
                    image: v.image,
                    videoFile: videoFile,
                    url: v.url,
                    user: {
                        name: v.user?.name || "",
                        url: v.user?.url || ""
                    }
                }
            })

        } catch (error) {
            console.error("StockAgent Error:", error)
            throw new Error(`Failed to fetch stock videos: ${(error as Error).message}`)
        }
    }
}
