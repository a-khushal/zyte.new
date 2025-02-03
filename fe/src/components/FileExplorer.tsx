import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { FileStructure } from '../types';

interface FileExplorerProps {
  files: FileStructure[];
  onFileSelect: (content: string) => void;
}

const FileExplorerItem: React.FC<{ item: FileStructure; onFileSelect: (content: string) => void }> = ({
  item,
  onFileSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else if (item.content) {
      onFileSelect(item.content);
    }
  };

  return (
    <div className="ml-4">
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
        onClick={handleClick}
      >
        {item.type === 'directory' ? (
          <>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Folder size={16} className="text-blue-500" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <File size={16} className="text-gray-500" />
          </>
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {item.type === 'directory' && isExpanded && item.children && (
        <div className="ml-2">
          {item.children.map((child, index) => (
            <FileExplorerItem key={index} item={child} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect }) => {
  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 px-4">File Structure</h2>
      {files.map((file, index) => (
        <FileExplorerItem key={index} item={file} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
};

export default FileExplorer;