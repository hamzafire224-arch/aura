import { useState, useEffect } from 'react';
import type { Edge, Node } from '@xyflow/react';

const initialNodes: Node[] = [
    { id: '1', position: { x: 400, y: 0 }, data: { label: 'Aura Manager', role: 'Manager', status: 'idle' }, type: 'agent' },
];

export function useGoldenDemo() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Start simulation sequence
        const timeOffset = 1000;

        // 1. Manager Intro
        setTimeout(() => {
            addMessage({ role: 'agent', agentName: 'Manager', content: 'Connecting to market streams...' });
            updateNodeStatus('1', 'working');
        }, timeOffset);

        // 2. Analyst Joins
        setTimeout(() => {
            const analystId = '2';
            addNode({ id: analystId, position: { x: 200, y: 150 }, data: { label: 'Market Analyst', role: 'Analyst', status: 'idle' }, type: 'agent' });
            addEdge({ id: 'e1-2', source: '1', target: analystId, animated: true });
            addMessage({ role: 'agent', agentName: 'Manager', content: 'Analyst active. Scanning high-growth niches.' });
        }, timeOffset + 2000);

        // 3. Analyst Works
        setTimeout(() => {
            updateNodeStatus('2', 'working');
            addMessage({ role: 'agent', agentName: 'Analyst', content: 'Detected viral pattern: #SleepMaxxing on TikTok.', type: 'tool_use' });
        }, timeOffset + 4000);

        // 4. Trend Found
        setTimeout(() => {
            addNode({ id: 't1', position: { x: 200, y: 300 }, data: { label: 'Sleep Supplements', growth: '+210%' }, type: 'trend' });
            addEdge({ id: 'e2-t1', source: '2', target: 't1', animated: true });
            addMessage({ role: 'agent', agentName: 'Analyst', content: 'Confirmed niche: Natural Sleep Aids. Competition is low quality.', type: 'result' });
            updateNodeStatus('2', 'idle');
        }, timeOffset + 7000);

    }, []);

    const addNode = (node: Node) => setNodes(prev => [...prev, node]);
    const addEdge = (edge: Edge) => setEdges(prev => [...prev, edge]);
    const updateNodeStatus = (id: string, status: 'idle' | 'working') => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, status } } : n));
    };
    const addMessage = (msg: any) => {
        setMessages(prev => [...prev, { ...msg, id: Math.random().toString(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    };

    return { nodes, edges, messages, setNodes, setEdges };
}
