import React from 'react';
import { CheckCircle2, RefreshCw, Database, Radio, MapPin, Target } from 'lucide-react';
import { DailyStats, User } from '../../types.js';

interface StatusBarProps {
  user: User | null;
  territoryName: string;
  stats: DailyStats | null;
  totalSchools: number;
  onOpenWarRoom: () => void;
  onOpenConflicts: () => void;
  pendingConflictsCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  user,
  territoryName,
  stats,
  totalSchools,
  onOpenWarRoom,
  onOpenConflicts,
  pendingConflictsCount
}) => {
  const pacePercent = stats?.todayTarget ? Math.round((stats.todayCompleted / stats.todayTarget) * 100) : 64;

  return (
    <footer className="h-6 bg-white border-t border-gray-200 text-gray-500 text-[11px] font-mono px-3 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left items */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-green-600 font-semibold">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>LIVE CLOUD RUN / LOCAL SYNC</span>
        </div>

        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span>{territoryName} ({totalSchools} Records)</span>
        </div>

        <button
          onClick={onOpenWarRoom}
          className="flex items-center space-x-1 text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer"
        >
          <Target className="w-3 h-3 text-orange-600" />
          <span>Pace: {stats?.todayCompleted || 42}/{stats?.todayTarget || 66} ({pacePercent}%)</span>
        </button>

        {pendingConflictsCount > 0 && (
          <button
            onClick={onOpenConflicts}
            className="flex items-center space-x-1 text-red-700 hover:text-red-800 font-bold bg-red-50 px-1.5 py-0.2 rounded border border-red-200 cursor-pointer"
          >
            <span>{pendingConflictsCount} Conflicts Detected</span>
          </button>
        )}
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-3 text-gray-500">
        <div className="flex items-center space-x-1">
          <Database className="w-3 h-3 text-indigo-600" />
          <span>JSON/Postgres Schema</span>
        </div>
        <span>TSM: {user?.name || 'Swapnil'}</span>
        <span className="text-gray-300">|</span>
        <span>UTF-8</span>
        <span className="text-gray-300">|</span>
        <span className="text-green-600 font-bold">PORT 3000 READY</span>
      </div>
    </footer>
  );
};
