import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  School as SchoolIcon,
  Flame,
  FileSpreadsheet,
  Download,
  Globe2,
  MessageSquare,
  X,
  User,
  MapPin,
  Smartphone
} from 'lucide-react';
import { School } from '../../types.js';
import { ActiveTab } from './ActivityRail.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
  onSelectSchool: (schoolId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenImport: () => void;
  onOpenDeployment: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  schools,
  onSelectSchool,
  onNavigateTab,
  onOpenImport,
  onOpenDeployment
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSchools = query.trim()
    ? schools
        .filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.area.toLowerCase().includes(query.toLowerCase()) ||
            s.schoolCode.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const actions = [
    {
      id: 'admin_panel',
      title: 'Master Admin Panel & School Fee Matrix (Deduplication, Reset & Overrides)',
      icon: <Smartphone className="w-4 h-4 text-indigo-600" />,
      run: () => {
        onNavigateTab('ADMIN_PANEL');
        onClose();
      }
    },
    {
      id: 'truecaller_verify',
      title: 'Truecaller & Telecom Number Accuracy Engine (Verify 330 Principals)',
      icon: <Smartphone className="w-4 h-4 text-emerald-600" />,
      run: () => {
        onNavigateTab('TRUECALLER_VERIFY');
        onClose();
      }
    },
    {
      id: 'war_room',
      title: 'Open 5-Day War Room (Target 66/day)',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      run: () => {
        onNavigateTab('WAR_ROOM');
        onClose();
      }
    },
    {
      id: 'import_csv',
      title: 'Import School CSV Batch (100 - 330 Schools)',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onOpenImport();
        onClose();
      }
    },
    {
      id: 'research_crawler',
      title: 'Open Web Research Scraper Queue',
      icon: <Globe2 className="w-4 h-4 text-blue-400" />,
      run: () => {
        onNavigateTab('RESEARCH_CENTER');
        onClose();
      }
    },
    {
      id: 'whatsapp_center',
      title: 'WhatsApp Communication Center & Templates',
      icon: <MessageSquare className="w-4 h-4 text-green-400" />,
      run: () => {
        onNavigateTab('WHATSAPP_CENTER');
        onClose();
      }
    },
    {
      id: 'download_zip',
      title: 'Download Standalone Production ZIP for Hoster / Local Server',
      icon: <Download className="w-4 h-4 text-purple-400" />,
      run: () => {
        onOpenDeployment();
        onClose();
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-2.5 border-b border-gray-200">
          <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search school name, area in Nagpur, or type action..."
            className="bg-transparent text-gray-900 placeholder-gray-400 text-xs focus:outline-none w-full"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-2.5">
          {/* Matched Schools */}
          {filteredSchools.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 font-mono">
                Matching Schools ({filteredSchools.length})
              </div>
              <div className="space-y-0.5">
                {filteredSchools.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSchool(s.id);
                      onClose();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-indigo-50/70 flex items-center justify-between text-xs group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <SchoolIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <div className="text-gray-900 font-semibold group-hover:text-indigo-900 truncate">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {s.area} • {s.board} • {s.studentStrength} students
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 group-hover:bg-indigo-100 group-hover:text-indigo-800">
                      Score: {s.dataConfidence}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 font-mono">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              {actions.map((act) => (
                <button
                  key={act.id}
                  onClick={act.run}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-gray-100 flex items-center space-x-2.5 text-xs text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <span className="shrink-0">{act.icon}</span>
                  <span className="font-medium">{act.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-3.5 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <span>Navigate with arrows • Enter to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
