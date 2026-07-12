'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export interface ContactNodeData {
  name: string;
  hats: string[];
  email?: string;
  phone?: string;
}

export interface DealNodeData {
  title: string;
  value: number;
  stage: string;
  contact: string;
}

export interface ProjectNodeData {
  title: string;
  status: string;
}

export interface TeamNodeData {
  name: string;
  role: string;
}

export const ContactNode = memo(({ data }: NodeProps<ContactNodeData>) => {
  return (
    <div className="bg-primary text-white p-4 rounded-lg shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary-light" />
      <div className="font-bold text-lg">{data.name}</div>
      <div className="text-sm opacity-90 mt-1">
        {data.hats.map(hat => (
          <span key={hat} className="inline-block bg-primary-dark text-xs px-2 py-1 rounded-full mr-1 mb-1">
            {hat}
          </span>
        ))}
      </div>
      {data.email && (
        <div className="text-xs opacity-75 mt-2">{data.email}</div>
      )}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary-light" />
    </div>
  );
});

ContactNode.displayName = 'ContactNode';

export const DealNode = memo(({ data }: NodeProps<DealNodeData>) => {
  const stageColors: Record<string, string> = {
    INQUIRY: 'bg-gray-600',
    QUALIFIED: 'bg-primary',
    PROPOSAL: 'bg-accent',
    NEGOTIATION: 'bg-orange-500',
    WON: 'bg-green-500',
    LOST: 'bg-danger',
  };

  return (
    <div className="bg-surface border border-gray-700 text-white p-4 rounded-lg shadow-lg min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-accent" />
      <div className="font-bold text-lg">{data.title}</div>
      <div className="text-2xl font-bold mt-2 text-accent">${data.value.toLocaleString()}</div>
      <div className="text-sm opacity-90 mt-1">{data.contact}</div>
      <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${stageColors[data.stage] || 'bg-gray-600'}`}>
        {data.stage}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-accent" />
    </div>
  );
});

DealNode.displayName = 'DealNode';

export const ProjectNode = memo(({ data }: NodeProps<ProjectNodeData>) => {
  const statusColors: Record<string, string> = {
    PLANNING: 'bg-accent',
    PRODUCTION: 'bg-primary',
    POST_PRODUCTION: 'bg-purple-500',
    COMPLETED: 'bg-green-500',
    ARCHIVED: 'bg-gray-500',
  };

  return (
    <div className="bg-primary-light text-white p-4 rounded-lg shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />
      <div className="font-bold text-lg">{data.title}</div>
      <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${statusColors[data.status] || 'bg-gray-600'}`}>
        {data.status.replace('_', ' ')}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </div>
  );
});

ProjectNode.displayName = 'ProjectNode';

export const TeamNode = memo(({ data }: NodeProps<TeamNodeData>) => {
  return (
    <div className="bg-accent text-black p-4 rounded-lg shadow-lg min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-accent-dark" />
      <div className="font-bold text-lg">{data.name}</div>
      <div className="text-sm opacity-90 mt-1">{data.role}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-accent-dark" />
    </div>
  );
});

TeamNode.displayName = 'TeamNode';