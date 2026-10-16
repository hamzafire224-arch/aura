import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Plus, Wand2 } from 'lucide-react';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start Here: Viral Idea' }, type: 'input' },
];

const initialEdges: Edge[] = [];

export function CanvasBoard() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isThinking, setIsThinking] = useState(false);

    const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), [setEdges]);

    // AI Director Action
    const handleBrainstorm = async () => {
        setIsThinking(true)
        // Simulation of AI agent working (Real implementation would call DirectorAgent)
        setTimeout(() => {
            const newNode: Node = {
                id: `node-${nodes.length + 1}`,
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: { label: 'AI Strategy: Human Shoot' },
            };
            setNodes((nds: any) => nds.concat(newNode));
            setIsThinking(false)
        }, 1500)
    }

    return (
        <div className="h-full w-full bg-transparent relative rounded-xl overflow-hidden border border-white/5">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                colorMode="dark"
            >
                <Controls className="bg-card/40 border-white/10 fill-white" />
                <MiniMap className="bg-card/40 border-white/10" nodeColor="#ec4899" maskColor="rgba(0, 0, 0, 0.6)" />
                <Background color="#333" gap={16} />

                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <Button
                        onClick={handleBrainstorm}
                        className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-600/20"
                    >
                        {isThinking ? <Wand2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        AI Brainstorm
                    </Button>
                    <Button variant="outline" className="bg-[#0B0E14]/50 backdrop-blur border-white/10">
                        <Plus className="mr-2 h-4 w-4" /> Add Note
                    </Button>
                </div>
            </ReactFlow>
        </div>
    );
}
