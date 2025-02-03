import React from 'react';
import { Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppBar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
        <Wand2 className="w-6 h-6" />
        <span className="text-xl font-semibold">WebGen</span>
      </Link>
      
      {/* <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors">
          Sign In
        </button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <LogIn className="w-4 h-4" />
          <span>Get Started</span>
        </button>
      </div> */}
    </div>
  );
};

export default AppBar;