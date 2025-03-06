import React from 'react';
import { Home, MessageSquare, Settings, HeartHandshake, Command, Plus } from 'lucide-react';

const ModernLeftNav = () => {
  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col w-16 items-center py-6">
      {/* Top logo */}
      <div className="mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
          <Command className="text-white w-4 h-4" />
        </div>
      </div>
      
      {/* Main navigation */}
      <nav className="flex-1 flex flex-col items-center gap-6">
        <NavItem icon={<Home size={20} />} active />
        <NavItem icon={<MessageSquare size={20} />} />
        <NavItem icon={<HeartHandshake size={20} />} />
        
        {/* New chat button */}
        <button className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors mt-4">
          <Plus size={20} />
        </button>
      </nav>
      
      {/* Bottom items */}
      <div className="mt-auto">
        <NavItem icon={<Settings size={20} />} />
        
        <div className="mt-5 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium">
          A
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ icon, active = false }: NavItemProps) => {
  return (
    <button 
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all
        ${active 
          ? 'bg-purple-100 text-purple-600' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
    >
      {icon}
    </button>
  );
};

export default ModernLeftNav; 