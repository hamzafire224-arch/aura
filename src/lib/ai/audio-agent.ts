const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ""

export type Voice = {
    id: string
    name: string
    category: string
    previewUrl?: string
}

export class AudioAgent {
    private baseUrl = "https://api.elevenlabs.io/v1"

    async getVoices(): Promise<Voice[]> {
        if (!ELEVENLABS_API_KEY) {
            throw new Error("Voice features require ElevenLabs API Key. Please configure VITE_ELEVENLABS_API_KEY in your environment.")
        }

        try {
            const response = await fetch(`${this.baseUrl}/voices`, {
                headers: { "xi-api-key": ELEVENLABS_API_KEY }
            })
            const data = await response.json()
            return data.voices.map((v: any) => ({
                id: v.voice_id,
                name: v.name,
                category: v.category || "General",
                previewUrl: v.preview_url
            })).slice(0, 10) // Limit to top 10 for UI
        } catch (error) {
            console.error("AudioAgent: Failed to fetch voices", error)
            return []
        }
    }

    async generateSpeech(text: string, voiceId: string): Promise<string | null> {
        if (!ELEVENLABS_API_KEY) {
            throw new Error("Speech generation requires ElevenLabs API Key. Please configure VITE_ELEVENLABS_API_KEY in your environment.")
        }

        try {
            const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            })

            if (!response.ok) throw new Error("TTS Request Failed")

            const blob = await response.blob()
            return URL.createObjectURL(blob)
        } catch (error) {
            console.error("AudioAgent: TTS failed", error)
            return null
        }
    }
}
