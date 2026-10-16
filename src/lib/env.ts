import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, "VITE_SUPABASE_ANON_KEY is required"),
  VITE_API_URL: z.string().url().optional().or(z.literal('')),
  VITE_WEBSOCKET_URL: z.string().url().optional().or(z.literal('')),
})

export const env = envSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  VITE_API_URL: import.meta.env.VITE_API_URL || '',
  VITE_WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || '',
})
