import React, { useState } from 'react';
import {
  Flame,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Zap,
  Users,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DailyStats, School } from '../../types.js';

interface WarRoomViewProps {
  stats: DailyStats | null;
  schools: School[];
  onSelectSchool: (schoolId: string) => void;
  onOpenSchoolsTab: () => void;
}

export const WarRoomView: React.FC<WarRoomViewProps> = ({
  stats,
  schools,
  onSelectSchool,
  onOpenSchoolsTab
}) => {
  const [activeDay, setActiveDay] = useState<number>(3); // currently Day 3

  const totalCampaignTarget = 330;
  const targetPerDay = 66;

  // Day 1 to 5 sprint data
  const days = [
    {
      day: 1,
      name: 'Day 1: Dharampeth & West Nagpur',
      target: 66,
      completed: 66,
      verified: 62,
      contacted: 66,
      meetings: 5,
      status: 'COMPLETED',
      date: 'Monday'
    },
    {
      day: 2,
      name: 'Day 2: Sadar, Civil Lines & North Nagpur',
      target: 66,
      completed: 66,
      verified: 59,
      contacted: 66,
      meetings: 6,
      status: 'COMPLETED',
      date: 'Tuesday'
    },
    {
      day: 3,
      name: 'Day 3: Ramdaspeth, Dhantoli & Central Nagpur',
      target: 66,
      completed: stats?.todayCompleted || 42,
      verified: 51,
      contacted: 42,
      meetings: 4,
      status: 'IN_PROGRESS',
      date: 'Today (Wednesday)'
    },
    {
      day: 4,
      name: 'Day 4: Wardhaman Nagar & East Nagpur',
      target: 66,
      completed: 0,
      verified: 48,
      contacted: 8,
      meetings: 2,
      status: 'UPCOMING',
      date: 'Thursday'
    },
    {
      day: 5,
      name: 'Day 5: Hingna, Wadi & South Nagpur (Final Sprint)',
      target: 66,
      completed: 0,
      verified: 44,
      contacted: 4,
      meetings: 1,
      status: 'UPCOMING',
      date: 'Friday'
    }
  ];

  const overallCompleted = 66 + 66 + (stats?.todayCompleted || 42);
  const overallPercent = Math.round((overallCompleted / totalCampaignTarget) * 100);

  return (
    <div className="space-y-4 pb-12">
      {/* War Room Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
              <span className="text-[10px] font-mono font-bold text-orange-700 uppercase tracking-wider">
                Five-Day Olympiad Blitz War Room
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-300">
                ACTIVE SPRINT: DAY 3 OF 5
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-1">
              330 Schools in 5 Days • Nagpur Territory Cadence
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Strict target of 66 verified outreach touchpoints per sales working day.
              Real-time conversion tracking across Principal calls, Coordinator WhatsApp messages, and Olympiad exam registrations.
            </p>
          </div>

          <div className="bg-indigo-900 text-white rounded-lg p-3 text-center min-w-[160px] shrink-0 shadow-sm">
            <div className="text-[10px] uppercase font-mono text-indigo-200">Total Campaign Pace</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {overallCompleted} / {totalCampaignTarget}
            </div>
            <div className="text-[11px] text-green-300 font-bold mt-0.5">{overallPercent}% on schedule</div>
          </div>
        </div>

        {/* 5-Day Visual Track Bar */}
        <div className="mt-4 space-y-1.5 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-500">Campaign Pacing Bar</span>
            <span className="text-indigo-700 font-bold">{overallCompleted} of 330 Schools Completed</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {days.map((d) => {
          const isSelected = activeDay === d.day;
          const statusBadge =
            d.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800 border-green-200'
              : d.status === 'IN_PROGRESS'
              ? 'bg-orange-100 text-orange-800 border-orange-200'
              : 'bg-gray-100 text-gray-600 border-gray-200';

          return (
            <div
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`rounded-lg border p-3 cursor-pointer transition-all shadow-xs ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 font-bold">{d.date}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusBadge}`}>
                  {d.status}
                </span>
              </div>

              <div className="mt-2">
                <div className="text-base font-bold text-gray-900">Day {d.day}</div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{d.name}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="text-gray-800 font-bold">{d.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Outreach:</span>
                  <span className={d.completed >= d.target ? 'text-green-700 font-bold' : 'text-orange-700 font-bold'}>
                    {d.completed} / {d.target}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Meetings:</span>
                  <span className="text-purple-700 font-bold">{d.meetings}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Tactical Checklist & Cadence Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase text-orange-700 font-bold">
                Tactical Breakdown
              </span>
              <span className="text-xs text-gray-500">• Day {activeDay} Focus Area</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mt-0.5">
              {days[activeDay - 1].name}
            </h3>
          </div>

          <button
            onClick={onOpenSchoolsTab}
            className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>Filter Master Table by Day {activeDay} Cluster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funnel conversion metrics for the day */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-gray-400 text-[10px] font-bold uppercase">Scheduled Schools</div>
            <div className="text-lg font-black text-gray-900 font-mono mt-0.5">66</div>
            <div className="text-[10px] text-gray-500">Dharampeth, Ramdaspeth, Sadar</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-gray-400 text-[10px] font-bold uppercase">Decision Makers Verified</div>
            <div className="text-lg font-black text-green-700 font-mono mt-0.5">
              {days[activeDay - 1].verified}
            </div>
            <div className="text-[10px] text-gray-500">Principals & Coordinators</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-gray-400 text-[10px] font-bold uppercase">WhatsApp & Calls Delivered</div>
            <div className="text-lg font-black text-blue-700 font-mono mt-0.5">
              {days[activeDay - 1].completed}
            </div>
            <div className="text-[10px] text-gray-500">1-Click Direct Touchpoints</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-gray-400 text-[10px] font-bold uppercase">Personal School Meetings</div>
            <div className="text-lg font-black text-purple-700 font-mono mt-0.5">
              {days[activeDay - 1].meetings}
            </div>
            <div className="text-[10px] text-gray-500">Specimen Sets Delivered</div>
          </div>
        </div>

        {/* Dynamic Fall-Behind Rescheduling Logic Explanation */}
        <div className="bg-orange-50 border border-orange-200 rounded p-3 flex items-start space-x-3">
          <Zap className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-orange-950">Dynamic Surge Cadence & Auto-Rebalancing</div>
            <p className="text-orange-900">
              If daily completed actions fall behind the 66 mark at 4:00 PM, the engine automatically calculates surge redistribution into morning calling windows (9:30 AM - 11:30 AM) for upcoming days, prioritizing high-density clusters in Dharampeth and Civil Lines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
