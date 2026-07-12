'use client';

import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  ConnectionLineType,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  ContactNode, 
  DealNode, 
  ProjectNode, 
  TeamNode,
  ContactNodeData,
  DealNodeData,
  ProjectNodeData,
  TeamNodeData
} from '@/components/Graph/CustomNodes';

const nodeTypes = {
  contact: ContactNode,
  deal: DealNode,
  project: ProjectNode,
  team: TeamNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function GraphViewPage() {
  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-surface border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white">Relationship Graph</h1>
        <p className="text-sm text-gray-400">Visualizing the journey from Lead → Deal → Project → Crew</p>
      </header>

      <div className="flex-1 bg-background/80">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">No relationships to display</p>
              <p className="text-sm mt-2">Add contacts, deals, and projects to see the graph.</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#374151" gap={16} />
            <Controls />
            <MiniMap
              nodeStrokeColor={(n) => {
                if (n.type === 'contact') return '#a833ff';
                if (n.type === 'deal') return '#fecb02';
                if (n.type === 'project') return '#c084fc';
                return '#9333ea';
              }}
              zoomable
              pannable
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}