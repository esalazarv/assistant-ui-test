import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const ModernTopNav = () => {
  return (
    <div className="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between">
      {/* Title / Current section */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Chat</h1>
      </div>
      
      {/* Search and actions */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="relative mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        
        {/* Notification button */}
        <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
          <Bell size={18} className="text-gray-600" />
        </button>
        
        {/* User profile */}
        <button className="flex items-center gap-2 ml-2">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-700 font-medium text-sm">A</span>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ModernTopNav; 