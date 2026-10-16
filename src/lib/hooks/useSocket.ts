import { useState, useEffect, useRef, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface Message {
    id: string;
    role: "agent" | "user" | "system";
    agentName?: string;
    content: string;
    timestamp: string;
    type?: "text" | "tool_use" | "result";
}

interface Metrics {
    aura_score: number;
    risk_level: string;
}

interface WarRoomState {
    nodes: Node[];
    edges: Edge[];
    messages: Message[];
    isConnected: boolean;
    sendMessage: (msg: string) => void;
    metrics: Metrics;
}

const initialNodes: Node[] = [
    { id: '1', position: { x: 400, y: 0 }, data: { label: 'Aura Manager', role: 'Manager', status: 'idle' }, type: 'agent' },
];

export function useSocket(): WarRoomState {
    const [messages, setMessages] = useState<Message[]>([]);
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState<Metrics>({ aura_score: 0, risk_level: "Analyzing..." });
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to FastAPI WebSocket
        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws/war-room';
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Connected to Aura Core');
            setIsConnected(true);
            addSystemMessage("Connected to Aura Intelligence Engine.");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "state_update") {
                    setMetrics(prev => ({ ...prev, ...data.payload }));
                } else {
                    const newMessage: Message = {
                        id: Math.random().toString(),
                        role: data.agent === 'system' ? 'system' : 'agent',
                        agentName: data.name || data.agent || 'Unknown',
                        content: data.message,
                        timestamp: new Date().toLocaleTimeString(),
                        type: data.type || 'text'
                    };

                    setMessages(prev => [...prev, newMessage]);

                    // Heuristic Graph Updates (Simple "parsing" for demo visual flair)
                    if (data.agent === 'Analyst') {
                        ensureAgentNode('2', 'Market Analyst', 'Analyst', { x: 200, y: 150 }, '1');
                    }
                    if (data.agent === 'Creative') {
                        ensureAgentNode('3', 'Creative Director', 'Designer', { x: 600, y: 150 }, '1');
                    }
                    if (data.agent === 'Strategist') {
                        ensureAgentNode('4', 'Strategist', 'Strategist', { x: 400, y: 300 }, '1');
                    }
                }

            } catch (e) {
                console.error("Failed to parse socket message", e);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from Aura Core');
            setIsConnected(false);
            addSystemMessage("Disconnected from Neural Link.");
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = useCallback((msg: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(msg);
            setMetrics({ aura_score: 0, risk_level: "Calculating..." }); // Reset on new run
            setMessages(prev => [...prev, {
                id: Math.random().toString(),
                role: 'user',
                content: msg,
                timestamp: new Date().toLocaleTimeString(),
                type: 'text'
            }]);
        } else {
            console.error("Socket not connected");
        }
    }, []);

    const addSystemMessage = (content: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            role: 'system',
            agentName: 'System',
            content,
            timestamp: new Date().toLocaleTimeString(),
            type: 'text'
        }]);
    };

    const ensureAgentNode = (id: string, label: string, role: string, pos: { x: number, y: number }, parentId?: string) => {
        setNodes(prev => {
            if (prev.find(n => n.id === id)) return prev.map(n => n.id === id ? { ...n, data: { ...n.data, status: 'working' } } : n);
            return [...prev, { id, position: pos, data: { label, role, status: 'working' }, type: 'agent' }];
        });
        if (parentId) {
            setEdges(prev => {
                const edgeId = `e${parentId}-${id}`;
                if (prev.find(e => e.id === edgeId)) return prev;
                return [...prev, { id: edgeId, source: parentId, target: id, animated: true }];
            });
        }
    };

    return { nodes, edges, messages, isConnected, sendMessage, metrics };
}
