import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Business } from "./BusinessContext"
import { type SpyDossier } from "@/lib/agents/spy/types"
import { toast } from "sonner"

export type Workflow = {
    id: string
    user_id: string
    title: string
    index: number
    business_id: string | null
    business?: Business // Joined data
    competitors: SpyDossier[] // Full data stored, UI only uses domain
    focus: string
    status: 'planning' | 'active' | 'review'
}

type WorkflowContextType = {
    workflows: Workflow[]
    isLoading: boolean
    createWorkflow: (title?: string) => Promise<void>
    deleteWorkflow: (id: string) => Promise<void>
    updateWorkflowFocus: (id: string, focus: string) => Promise<void>
    updateWorkflowTitle: (id: string, title: string) => Promise<void>
    updateWorkflowStatus: (id: string, status: 'planning' | 'active' | 'review') => Promise<void>

    // Business Management
    setWorkflowBusiness: (workflowId: string, businessId: string) => Promise<void>
    removeWorkflowBusiness: (workflowId: string) => Promise<void>

    // Competitor Management
    addCompetitorToWorkflow: (workflowId: string, data: SpyDossier) => Promise<{ success: boolean; error?: string }>
    removeCompetitorFromWorkflow: (workflowId: string, domain: string) => Promise<void>
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export const useWorkflow = () => {
    const context = useContext(WorkflowContext)
    if (!context) throw new Error("useWorkflow must be used within a WorkflowProvider")
    return context
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setWorkflows([])
            setIsLoading(false)
            return
        }
        fetchWorkflows()
    }, [user])

    const fetchWorkflows = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('workflows')
            .select('*, business:businesses(*)')
            .eq('user_id', user?.id)
            .order('index', { ascending: true })
            .order('created_at', { ascending: true })

        if (error) {
            console.error("Error fetching workflows:", error)
        } else {
            setWorkflows(data || [])
        }
        setIsLoading(false)
    }

    const createWorkflow = async (title: string = "New Operation") => {
        if (!user) return

        const newIndex = workflows.length + 1
        const newWorkflow = {
            user_id: user.id,
            title: title + " " + newIndex,
            // Legacy compatibility: ensure 'name' is populated if DB still requires it
            name: title + " " + newIndex,
            index: newIndex,
            competitors: [],
            focus: "Growth",
            status: "planning"
        }

        // Optimistic
        const tempId = crypto.randomUUID()
        setWorkflows(prev => [...prev, { ...newWorkflow, id: tempId, business_id: null } as Workflow])

        const { data, error } = await supabase.from('workflows').insert([newWorkflow]).select().single()

        if (error) {
            console.error("Error creating workflow:", error)
            toast.error("Failed to save operation to command center.")
            // Revert optimistic update
            setWorkflows(prev => prev.filter(w => w.id !== tempId))
        } else if (data) {
            // Replace temp with real
            setWorkflows(prev => prev.map(w => w.id === tempId ? { ...w, id: data.id } : w))
            toast.success("New Operation Initialized.")
        }
    }

    const deleteWorkflow = async (id: string) => {
        if (!user) return
        setWorkflows(prev => prev.filter(w => w.id !== id))
        await supabase.from('workflows').delete().eq('id', id)
    }

    const updateWorkflowFocus = async (id: string, focus: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, focus } : w))
        await supabase.from('workflows').update({ focus }).eq('id', id)
    }

    const updateWorkflowTitle = async (id: string, title: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, title } : w))
        await supabase.from('workflows').update({ title }).eq('id', id)
    }

    const updateWorkflowStatus = async (id: string, status: 'planning' | 'active' | 'review') => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status } : w))
        await supabase.from('workflows').update({ status }).eq('id', id)
    }

    const setWorkflowBusiness = async (workflowId: string, businessId: string) => {
        // Find business details locally if possible to update UI immediately
        // Note: In a real app we might need access to BusinessContext here, but for now we'll rely on a refresh or just ID update
        // To do this cleanly, we'll assume the component calling this triggers a refresh or we store business data

        setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, business_id: businessId } : w))

        const { error } = await supabase.from('workflows').update({ business_id: businessId }).eq('id', workflowId)
        if (!error) {
            fetchWorkflows() // Refresh to get the joined business data
        }
    }

    const removeWorkflowBusiness = async (workflowId: string) => {
        setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, business_id: null, business: undefined } : w))
        await supabase.from('workflows').update({ business_id: null }).eq('id', workflowId)
    }

    const addCompetitorToWorkflow = async (workflowId: string, data: SpyDossier) => {
        const workflow = workflows.find(w => w.id === workflowId)
        if (!workflow) return { success: false, error: "Workflow not found" }

        if (workflow.competitors.length >= 2) {
            return { success: false, error: "Maximum 2 competitors allowed per workflow." }
        }

        if (workflow.competitors.some(c => c.domain === data.domain)) {
            return { success: false, error: "Competitor already in this workflow." }
        }

        const newCompetitors = [...workflow.competitors, data]
        setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, competitors: newCompetitors } : w))

        // Persist full object array
        const { error } = await supabase.from('workflows').update({ competitors: newCompetitors as any }).eq('id', workflowId)

        if (error) {
            setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, competitors: workflow.competitors } : w))
            return { success: false, error: error.message }
        }

        return { success: true }
    }

    const removeCompetitorFromWorkflow = async (workflowId: string, domain: string) => {
        const workflow = workflows.find(w => w.id === workflowId)
        if (!workflow) return

        const newCompetitors = workflow.competitors.filter(c => c.domain !== domain)
        setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, competitors: newCompetitors } : w))

        await supabase.from('workflows').update({ competitors: newCompetitors as any }).eq('id', workflowId)
    }

    return (
        <WorkflowContext.Provider value={{
            workflows, isLoading, createWorkflow, deleteWorkflow, updateWorkflowFocus, updateWorkflowTitle, updateWorkflowStatus,
            setWorkflowBusiness, removeWorkflowBusiness,
            addCompetitorToWorkflow, removeCompetitorFromWorkflow
        }}>
            {children}
        </WorkflowContext.Provider>
    )
}
