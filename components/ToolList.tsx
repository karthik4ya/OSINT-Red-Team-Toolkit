
import React from 'react';
import { OsintTool } from '../types';
import { ToolCard } from './ToolCard';

interface ToolListProps {
  tools: OsintTool[];
}

export const ToolList: React.FC<ToolListProps> = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
