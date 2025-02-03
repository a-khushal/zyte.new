import React from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  className?: string;
  id: 'steps' | 'explorer';
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, className = '', id }) => {
  return (
    <div
      data-resize-handle={id}
      className={`w-1 hover:w-1 bg-gray-200 hover:bg-indigo-500 cursor-col-resize transition-colors ${className}`}
      onMouseDown={onMouseDown}
    >
      <div className="h-full w-4 -ml-1.5" />
    </div>
  );
};

export default ResizeHandle;