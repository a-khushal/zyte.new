import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import FileExplorer from '../components/FileExplorer';
import StepsList from '../components/StepsList';
import ResizeHandle from '../components/ResizeHandle';
import { FileStructure } from '../types';
import AppBar from '../components/Appbar';

const Generator: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [stepsWidth, setStepsWidth] = useState(320);
  const [explorerWidth, setExplorerWidth] = useState(320);
  const [isResizing, setIsResizing] = useState<'steps' | 'explorer' | null>(null);

  // Mock data with improved steps
  const mockSteps = [
    'Project Initialization',
    'Component Structure',
    'UI Layout Design',
    'Core Features',
    'Styling Implementation',
    'Performance Optimization',
    'Deployment Preparation'
  ];

  const mockFiles: FileStructure[] = [
    {
      name: 'src',
      type: 'directory',
      children: [
        {
          name: 'components',
          type: 'directory',
          children: [
            {
              name: 'Header.tsx',
              type: 'file',
              content: 'export const Header = () => {\n  return <header>Header Component</header>;\n}'
            },
            {
              name: 'Footer.tsx',
              type: 'file',
              content: 'export const Footer = () => {\n  return <footer>Footer Component</footer>;\n}'
            }
          ]
        },
        {
          name: 'App.tsx',
          type: 'file',
          content: 'function App() {\n  return <div>Hello World</div>;\n}'
        },
        {
          name: 'styles',
          type: 'directory',
          children: [
            {
              name: 'main.css',
              type: 'file',
              content: 'body {\n  margin: 0;\n  padding: 0;\n}'
            }
          ]
        }
      ]
    }
  ];

  // Function to find a file by name in the file structure
  const findFileByName = (files: FileStructure[], name: string): string | null => {
    for (const file of files) {
      if (file.type === 'file' && file.name === name) {
        return file.content || '';
      }
      if (file.type === 'directory' && file.children) {
        const found = findFileByName(file.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  // Set default file content on mount
  useEffect(() => {
    const defaultFileContent = findFileByName(mockFiles, 'App.tsx');
    if (defaultFileContent) {
      setSelectedCode(defaultFileContent);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    if (isResizing === 'steps') {
      const newWidth = Math.max(250, Math.min(600, e.clientX));
      setStepsWidth(newWidth);
    } else if (isResizing === 'explorer') {
      const newWidth = Math.max(250, Math.min(600, e.clientX - stepsWidth));
      setExplorerWidth(newWidth);
    }
  }, [isResizing, stepsWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = (id: 'steps' | 'explorer') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppBar />
      <div className="flex-1 flex">
        {/* Left Sidebar - Steps */}
        <div style={{ width: stepsWidth }} className="flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <StepsList steps={mockSteps} currentStep={4} />
        </div>
        
        <ResizeHandle
          id="steps"
          onMouseDown={handleResizeStart('steps')}
          className="relative z-10"
        />

        {/* Middle Section - File Explorer */}
        <div style={{ width: explorerWidth }} className="flex-shrink-0 bg-white border-r border-gray-200">
          <FileExplorer
            files={mockFiles}
            onFileSelect={setSelectedCode}
          />
        </div>

        <ResizeHandle
          id="explorer"
          onMouseDown={handleResizeStart('explorer')}
          className="relative z-10"
        />

        {/* Right Section - Code Editor and Preview */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'code'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('code')}
              >
                Code
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'preview'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'code' ? (
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={selectedCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white">
                <iframe
                  title="Preview"
                  className="w-full h-full border-none"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>${selectedCode}</style>
                      </head>
                      <body>
                        <div id="root"></div>
                        <script type="module">
                          ${selectedCode}
                        </script>
                      </body>
                    </html>
                  `}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;