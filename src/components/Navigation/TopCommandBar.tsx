import React from 'react';
import {
  Search,
  Plus,
  Upload,
  Download,
  Flame,
  Globe,
  Layers,
  UserCheck,
  Building2,
  ChevronDown,
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { User, Territory } from '../../types.js';

interface TopCommandBarProps {
  currentUser: User | null;
  territories: Territory[];
  selectedTerritoryId: string;
  onSelectTerritory: (id: string) => void;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  onOpenCommandPalette: () => void;
  onOpenAddSchool: () => void;
  onOpenImport: () => void;
  onOpenWarRoom: () => void;
  onOpenDeployment: () => void;
  onOpenBrochure?: () => void;
  onOpenAdmin?: () => void;
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  currentUser,
  territories,
  selectedTerritoryId,
  onSelectTerritory,
  availableUsers,
  onSwitchUser,
  onOpenCommandPalette,
  onOpenAddSchool,
  onOpenImport,
  onOpenWarRoom,
  onOpenDeployment,
  onOpenBrochure,
  onOpenAdmin,
  onSearchChange,
  searchQuery
}) => {
  return (
    <header className="h-12 bg-white border-b border-gray-200 text-gray-800 flex items-center justify-between px-3 select-none z-30 shrink-0 shadow-xs">
      {/* Brand & Territory */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-indigo-900 flex items-center justify-center font-black text-xs text-white tracking-wider shadow-sm">
            OS
          </div>
          <span className="font-bold text-sm tracking-tight text-gray-900 hidden sm:inline underline decoration-indigo-400 underline-offset-4">
            School Sales OS
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 font-mono border border-green-200">
            v2.4 Nagpur Live
          </span>
        </div>

        {/* Territory Selector */}
        <div className="relative flex items-center ml-2">
          <Building2 className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
          <select
            value={selectedTerritoryId}
            onChange={(e) => onSelectTerritory(e.target.value)}
            className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded px-2.5 py-1 pr-6 border border-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none shadow-xs"
          >
            <option value="terr-all">All India (Master View)</option>
            {territories.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.totalSchools} Schools)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-500 absolute right-1.5 pointer-events-none" />
        </div>
      </div>

      {/* Center Command Bar / Quick Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div
          onClick={onOpenCommandPalette}
          className="w-full bg-gray-50 hover:bg-white border border-gray-300 hover:border-indigo-400 rounded-md px-3 py-1 flex items-center justify-between text-xs text-gray-500 cursor-pointer transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">
              {searchQuery ? `Searching: "${searchQuery}"` : 'Type a command or search school, principal, code...'}
            </span>
          </div>
          <kbd className="hidden md:inline-flex items-center space-x-0.5 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-600">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {onOpenBrochure && (
          <button
            onClick={onOpenBrochure}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-extrabold border border-rose-200 transition-colors shadow-xs cursor-pointer"
            title="SilverZone 2026-27 Brochure - Registration Extended till 30/31 Sept"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-700" />
            <span className="hidden md:inline">Brochure</span>
            <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
              Ext: 30/31 Sept
            </span>
          </button>
        )}

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-xs cursor-pointer"
            title="Master Admin Panel & Fees Management"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Admin Panel</span>
          </button>
        )}

        <button
          onClick={onOpenWarRoom}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition-colors shadow-xs"
          title="Open 5-Day Campaign War Room"
        >
          <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
          <span className="hidden lg:inline">5-Day War Room</span>
          <span className="bg-orange-600 text-white text-[10px] font-bold px-1 rounded ml-1">
            66/d
          </span>
        </button>

        <button
          onClick={onOpenImport}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium border border-gray-300 shadow-xs transition-colors"
          title="Import CSV or Excel Batch"
        >
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span className="hidden sm:inline">Import Batch</span>
        </button>

        <button
          onClick={onOpenAddSchool}
          className="flex items-center space-x-1 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add School</span>
        </button>

        <button
          onClick={onOpenDeployment}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors shadow-xs"
          title="Download ZIP for Hoster / Local / Production"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden xl:inline">ZIP / Deploy</span>
        </button>

        {/* User Role Switcher */}
        <div className="relative pl-1 border-l border-gray-200 flex items-center">
          <div className="flex items-center space-x-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <div className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {currentUser?.name?.slice(0, 1) || 'U'}
            </div>
            <select
              value={currentUser?.id || 'usr-1'}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="bg-transparent text-gray-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-white text-gray-800">
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
