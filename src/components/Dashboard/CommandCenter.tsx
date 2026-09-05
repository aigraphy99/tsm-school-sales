import React from 'react';
import {
  Flame,
  PhoneCall,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { DailyStats, NextActionItem, User, School } from '../../types.js';

interface CommandCenterProps {
  user: User | null;
  stats: DailyStats | null;
  nextActions: NextActionItem[];
  onSelectSchool: (schoolId: string) => void;
  onOpenQuickWhatsApp: (school: { id: string; name: string; phone: string; contactName: string }) => void;
  onOpenWarRoom: () => void;
  onOpenResearch: () => void;
  onOpenConflicts: () => void;
  pendingConflictsCount: number;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  user,
  stats,
  nextActions,
  onSelectSchool,
  onOpenQuickWhatsApp,
  onOpenWarRoom,
  onOpenResearch,
  onOpenConflicts,
  pendingConflictsCount
}) => {
  const target = stats?.todayTarget || 66;
  const completed = stats?.todayCompleted || 42;
  const remaining = Math.max(0, target - completed);
  const pct = Math.round((completed / target) * 100);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Hero: TSM Target Command Strip */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 font-mono">
                Daily Sales Command Center
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Good morning, {user?.name?.toUpperCase() || 'SWAPNIL'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Assigned Territory: <span className="text-gray-800 font-semibold">{user?.territoryName || 'Nagpur District'}</span> • 330 CBSE & ICSE Premier Schools
            </p>
          </div>

          {/* Today's Target Card (High Density Indigo Box) */}
          <div className="bg-indigo-900 text-white rounded-lg p-3 flex items-center space-x-5 shrink-0 shadow-md">
            <div className="text-center">
              <div className="text-[10px] font-mono uppercase text-indigo-200">Today's Target</div>
              <div className="text-xl font-black text-white">{target}</div>
              <div className="text-[9px] text-indigo-300 font-mono">schools/day</div>
            </div>

            <div className="h-8 w-px bg-indigo-700" />

            <div className="text-center">
              <div className="text-[10px] font-mono uppercase text-green-300 font-medium">Completed</div>
              <div className="text-xl font-black text-green-300">{completed}</div>
              <div className="text-[9px] text-green-200 font-mono">{pct}% achieved</div>
            </div>

            <div className="h-8 w-px bg-indigo-700" />

            <div className="text-center">
              <div className="text-[10px] font-mono uppercase text-orange-300 font-medium">Remaining</div>
              <div className="text-xl font-black text-orange-300">{remaining}</div>
              <div className="text-[9px] text-orange-200 font-mono">To close today</div>
            </div>

            <button
              onClick={onOpenWarRoom}
              className="px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>War Room</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Today's Cadence Pace: 4.8 schools/hour required to achieve 66 daily target</span>
            <span className="font-mono text-indigo-700 font-bold">{completed} of {target} Done ({pct}%)</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Core Operational KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-gray-300 transition-colors">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Assigned</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">{stats?.assignedCount || 330}</div>
          <div className="text-[10px] text-gray-500">Total Database</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-green-300 transition-colors">
          <div className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Verified</div>
          <div className="text-lg font-bold text-green-600 mt-0.5">{stats?.verifiedCount || 274}</div>
          <div className="text-[10px] text-gray-500">83% High Confidence</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-blue-300 transition-colors">
          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Contacted</div>
          <div className="text-lg font-bold text-blue-600 mt-0.5">{stats?.contactedCount || 186}</div>
          <div className="text-[10px] text-gray-500">Calls & WhatsApp</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-green-300 transition-colors">
          <div className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Replies</div>
          <div className="text-lg font-bold text-green-700 mt-0.5">{stats?.repliesCount || 52}</div>
          <div className="text-[10px] text-gray-500">Read & Inbound</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-purple-300 transition-colors">
          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-tight">Meetings</div>
          <div className="text-lg font-bold text-purple-600 mt-0.5">{stats?.meetingsCount || 18}</div>
          <div className="text-[10px] text-gray-500">In-Person & Virtual</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-orange-300 transition-colors">
          <div className="text-[10px] font-bold text-orange-700 uppercase tracking-tight">Olympiads</div>
          <div className="text-lg font-bold text-orange-600 mt-0.5">{stats?.olympiadCount || 41}</div>
          <div className="text-[10px] text-gray-500">Active Deals</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-tight">Books</div>
          <div className="text-lg font-bold text-indigo-700 mt-0.5">{stats?.booksCount || 24}</div>
          <div className="text-[10px] text-gray-500">Specimen Sets</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2.5 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Orders Won</div>
          <div className="text-lg font-bold text-emerald-600 mt-0.5">{stats?.ordersCount || 12}</div>
          <div className="text-[10px] text-gray-500">Confirmed</div>
        </div>
      </div>

      {/* Actionable alerts strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {pendingConflictsCount > 0 ? (
          <div
            onClick={onOpenConflicts}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-red-100/70 transition-colors shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-900">
                  {pendingConflictsCount} Schools with Principal Data Conflict
                </div>
                <div className="text-[11px] text-red-700">Web research found conflicting names</div>
              </div>
            </div>
            <span className="text-xs text-red-800 font-bold px-2 py-1 bg-red-200/80 rounded">Resolve</span>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-gray-800">All Scraper Conflicts Resolved</div>
              <div className="text-[11px] text-gray-500">Database verified clean</div>
            </div>
          </div>
        )}

        <div
          onClick={onOpenResearch}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-blue-900">56 Schools Need Coordinator WhatsApp</div>
              <div className="text-[11px] text-blue-700">Run automated SearXNG web crawler</div>
            </div>
          </div>
          <span className="text-xs text-blue-800 font-bold px-2 py-1 bg-blue-200/80 rounded">Launch</span>
        </div>

        <div
          onClick={onOpenWarRoom}
          className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-orange-100/70 transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-orange-900">Olympiad 5-Day Sprint Pace</div>
              <div className="text-[11px] text-orange-700">Day 3 of 5 • On track to complete 330</div>
            </div>
          </div>
          <span className="text-xs text-orange-800 font-bold px-2 py-1 bg-orange-200/80 rounded">View Plan</span>
        </div>
      </div>

      {/* CORE FEATURE: NEXT 10 ACTIONS RANKED ENGINE */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold uppercase">
                Prioritized Execution Engine
              </span>
              <span className="text-xs text-gray-500">Updated in real-time</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight mt-1">
              Next 10 High-Impact Actions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ranked by student strength, recent prospectus opens, follow-up deadlines, and conversion probability.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-500 font-mono">
              Action Cadence: 1 action / 8 mins
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100 mt-1">
          {nextActions.map((item, idx) => {
            const actionBadgeColor =
              item.action === 'CALL PRINCIPAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : item.action === 'FOLLOW UP NOW'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : item.action === 'VERIFY COORDINATOR'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-green-50 text-green-700 border-green-200';

            return (
              <div
                key={item.id}
                className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-indigo-50/50 rounded px-2 transition-colors group"
              >
                {/* Left: Ranking number + Details */}
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <button
                        onClick={() => onSelectSchool(item.schoolId)}
                        className="text-xs font-bold text-gray-900 hover:text-indigo-700 transition-colors text-left"
                      >
                        {item.schoolName}
                      </button>
                      <span className="text-xs text-gray-500">({item.area})</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${actionBadgeColor}`}>
                        {item.action}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                        {item.priority}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mt-0.5 flex items-center space-x-2">
                      <span className="text-orange-600 font-bold">Why:</span>
                      <span>{item.reason}</span>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center space-x-3">
                      <span>Contact: <strong className="text-gray-800">{item.contactName}</strong></span>
                      {item.contactPhone && (
                        <span>Phone: <strong className="text-gray-800 font-mono">+91 {item.contactPhone}</strong></span>
                      )}
                      <span className="text-gray-300">•</span>
                      <span className="text-green-700 font-mono font-medium">{item.dueText}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-center">
                  {item.contactPhone && (
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="px-2.5 py-1 rounded bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium border border-gray-300 flex items-center space-x-1 transition-colors shadow-xs"
                      title="Direct Voice Call"
                    >
                      <PhoneCall className="w-3 h-3 text-blue-600" />
                      <span>Call</span>
                    </a>
                  )}

                  <button
                    onClick={() =>
                      onOpenQuickWhatsApp({
                        id: item.schoolId,
                        name: item.schoolName,
                        phone: item.contactPhone || '',
                        contactName: item.contactName || 'Principal'
                      })
                    }
                    className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 fill-white" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onSelectSchool(item.schoolId)}
                    className="px-2 py-1 rounded bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium border border-gray-300 flex items-center space-x-1 transition-colors shadow-xs cursor-pointer"
                    title="Open Complete School 360"
                  >
                    <span>360°</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
