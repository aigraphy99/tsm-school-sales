import React from 'react';
import {
  Kanban,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Users,
  Award
} from 'lucide-react';
import { School, PipelineStage } from '../../types.js';

interface PipelineViewProps {
  schools: School[];
  onSelectSchool: (schoolId: string) => void;
  onStageChange: (schoolId: string, newStage: PipelineStage) => void;
  onQuickWhatsApp: (school: { id: string; name: string; phone?: string; contactName?: string }) => void;
}

const LANES: { id: PipelineStage; title: string; color: string }[] = [
  { id: 'DATA_VERIFIED', title: 'Data Verified', color: 'border-blue-500 text-blue-700 bg-blue-50/50' },
  { id: 'FIRST_CONTACT', title: 'First Contact', color: 'border-teal-500 text-teal-700 bg-teal-50/50' },
  { id: 'WHATSAPP_SENT', title: 'WhatsApp Sent', color: 'border-green-500 text-green-700 bg-green-50/50' },
  { id: 'ENGAGED', title: 'Engaged / Replies', color: 'border-indigo-500 text-indigo-700 bg-indigo-50/50' },
  { id: 'MEETING', title: 'Meeting Scheduled', color: 'border-purple-500 text-purple-700 bg-purple-50/50' },
  { id: 'OLYMPIAD_DISCUSSION', title: 'Olympiad Pitch', color: 'border-orange-500 text-orange-700 bg-orange-50/50' },
  { id: 'WON', title: 'Registered / Won', color: 'border-emerald-600 text-emerald-800 bg-emerald-50/50' }
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  schools,
  onSelectSchool,
  onStageChange,
  onQuickWhatsApp
}) => {
  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Sales Pipeline Kanban Board
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Progress schools through outreach, meetings, and Olympiad registration.
          </p>
        </div>
      </div>

      {/* Horizontal Kanban Scrollable Container */}
      <div className="flex space-x-3 overflow-x-auto pb-4 pt-1 select-none">
        {LANES.map((lane) => {
          const laneSchools = schools.filter((s) => s.stage === lane.id);

          return (
            <div
              key={lane.id}
              className="w-72 shrink-0 bg-white border border-gray-200 rounded-lg flex flex-col max-h-[calc(100vh-210px)] shadow-xs"
            >
              {/* Lane Header */}
              <div className={`p-2.5 border-b border-gray-200 flex items-center justify-between border-t-2 ${lane.color}`}>
                <div className="font-bold text-xs">{lane.title}</div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {laneSchools.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/60">
                {laneSchools.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-gray-200 hover:border-indigo-300 rounded p-2.5 space-y-2 group transition-all hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        s.priority === 'P1' ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold' : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {s.priority}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {s.studentStrength} students
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() => onSelectSchool(s.id)}
                        className="text-xs font-bold text-gray-900 hover:text-indigo-700 text-left line-clamp-2 transition-colors cursor-pointer"
                      >
                        {s.name}
                      </button>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {s.area} • {s.board}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            onQuickWhatsApp({
                              id: s.id,
                              name: s.name,
                              phone: s.officialPhone
                            })
                          }
                          className="p-1 rounded bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-200 transition-colors cursor-pointer"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onSelectSchool(s.id)}
                          className="p-1 rounded bg-gray-50 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                          title="Open 360"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Advance Stage buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            const idx = LANES.findIndex((l) => l.id === lane.id);
                            if (idx < LANES.length - 1) {
                              onStageChange(s.id, LANES[idx + 1].id);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-indigo-600 text-gray-700 hover:text-white border border-gray-200 text-[10px] font-bold flex items-center space-x-0.5 transition-colors cursor-pointer"
                          title="Advance to next stage"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {laneSchools.length === 0 && (
                  <div className="py-8 text-center text-xs text-gray-400 italic">
                    No schools in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
