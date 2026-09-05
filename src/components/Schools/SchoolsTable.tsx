import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Phone,
  MessageSquare,
  Globe2,
  ExternalLink,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { School, PipelineStage } from '../../types.js';

interface SchoolsTableProps {
  schools: School[];
  totalSchools: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectSchool: (schoolId: string) => void;
  onStageChange: (schoolId: string, newStage: PipelineStage) => void;
  onResearchSchool: (schoolId: string) => void;
  onQuickWhatsApp: (school: { id: string; name: string; phone?: string; contactName?: string }) => void;
  onBulkResearch: (schoolIds: string[]) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterBoard: string;
  onFilterBoardChange: (b: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (p: string) => void;
  filterStage: string;
  onFilterStageChange: (s: string) => void;
  filterUnverifiedOnly: boolean;
  onFilterUnverifiedChange: (val: boolean) => void;
}

const STAGE_OPTIONS: PipelineStage[] = [
  'UNVERIFIED',
  'DATA_VERIFIED',
  'DECISION_MAKER_IDENTIFIED',
  'FIRST_CONTACT',
  'WHATSAPP_SENT',
  'BROCHURE_SENT',
  'ENGAGED',
  'CONVERSATION',
  'MEETING',
  'OLYMPIAD_DISCUSSION',
  'BOOK_DISCUSSION',
  'REGISTRATION',
  'ORDER',
  'WON',
  'LOST',
  'NO_RESPONSE',
  'CALL_BACK',
  'VISIT_REQUIRED',
  'NOT_INTERESTED'
];

export const SchoolsTable: React.FC<SchoolsTableProps> = ({
  schools,
  totalSchools,
  currentPage,
  totalPages,
  onPageChange,
  onSelectSchool,
  onStageChange,
  onResearchSchool,
  onQuickWhatsApp,
  onBulkResearch,
  searchQuery,
  onSearchChange,
  filterBoard,
  onFilterBoardChange,
  filterPriority,
  onFilterPriorityChange,
  filterStage,
  onFilterStageChange,
  filterUnverifiedOnly,
  onFilterUnverifiedChange
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [freezeColumn, setFreezeColumn] = useState<boolean>(true);

  const toggleSelectAll = () => {
    if (selectedIds.size === schools.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(schools.map((s) => s.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleExportSelectedCsv = () => {
    const target = schools.filter((s) => selectedIds.has(s.id));
    let csv = 'Code,Name,Area,City,Board,Priority,Stage,Score,Strength,Phone\n';
    target.forEach((s) => {
      csv += `"${s.schoolCode}","${s.name.replace(/"/g, '""')}","${s.area}","${s.city}","${s.board}","${s.priority}","${s.stage}",${s.dataConfidence},${s.studentStrength},"${s.officialPhone || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schools_selected_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-3 pb-12">
      {/* Search & Filter Controls Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search school name, Nagpur area (e.g. Ramdaspeth, Sadar), code..."
              className="w-full bg-gray-50 border border-gray-300 rounded pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2 text-xs">
            {/* Board Filter */}
            <select
              value={filterBoard}
              onChange={(e) => onFilterBoardChange(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Boards</option>
              <option value="CBSE">CBSE Board</option>
              <option value="ICSE">ICSE Board</option>
              <option value="State Board">State Board</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => onFilterPriorityChange(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1">P1 - High Density</option>
              <option value="P2">P2 - Standard</option>
              <option value="P3">P3 - Nurture</option>
            </select>

            {/* Stage Filter */}
            <select
              value={filterStage}
              onChange={(e) => onFilterStageChange(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[150px] truncate shadow-xs"
            >
              <option value="ALL">All Stages</option>
              {STAGE_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {/* Unverified toggle */}
            <button
              onClick={() => onFilterUnverifiedChange(!filterUnverifiedOnly)}
              className={`px-2.5 py-1.5 rounded font-medium border transition-colors flex items-center space-x-1 cursor-pointer shadow-xs ${
                filterUnverifiedOnly
                  ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                  : 'bg-white text-gray-600 border-gray-300 hover:text-gray-900'
              }`}
            >
              <span>Score &lt; 75%</span>
            </button>

            {/* Freeze column switch */}
            <button
              onClick={() => setFreezeColumn(!freezeColumn)}
              className={`px-2 py-1.5 rounded text-[11px] font-mono border transition-colors cursor-pointer shadow-xs ${
                freezeColumn
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
              title="Freeze School Name Column"
            >
              Freeze Col: {freezeColumn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Bulk Actions Banner (appears when rows selected) */}
        {selectedIds.size > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded px-3 py-2 flex items-center justify-between text-xs text-indigo-900 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{selectedIds.size}</span> schools selected
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkResearch(Array.from(selectedIds))}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Run Web Crawler ({selectedIds.size})</span>
              </button>
              <button
                onClick={handleExportSelectedCsv}
                className="px-2.5 py-1 rounded bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium flex items-center space-x-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-indigo-700 hover:text-indigo-900 px-2 py-1 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Desktop Excel-Style Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 font-mono uppercase tracking-wider text-[10px] border-b border-gray-200 select-none">
                <th className="py-2.5 px-3 w-10 text-center">
                  <button onClick={toggleSelectAll} className="hover:text-gray-900 cursor-pointer">
                    {selectedIds.size === schools.length && schools.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-2 w-16">Prio</th>
                <th
                  className={`py-2.5 px-3 min-w-[240px] ${
                    freezeColumn ? 'sticky left-0 bg-gray-100 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]' : ''
                  }`}
                >
                  School Name & Code
                </th>
                <th className="py-2.5 px-3 min-w-[130px]">Area / City</th>
                <th className="py-2.5 px-3 w-20">Board</th>
                <th className="py-2.5 px-3 w-20 text-right">Strength</th>
                <th className="py-2.5 px-3 min-w-[150px]">Data Confidence</th>
                <th className="py-2.5 px-3 min-w-[180px]">Sales Pipeline Stage</th>
                <th className="py-2.5 px-3 min-w-[150px]">Next Follow-up</th>
                <th className="py-2.5 px-3 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {schools.map((s) => {
                const isSelected = selectedIds.has(s.id);
                const scoreGrade =
                  s.dataConfidence >= 90 ? 'A' : s.dataConfidence >= 75 ? 'B' : s.dataConfidence >= 50 ? 'C' : 'D';
                const scoreColor =
                  scoreGrade === 'A'
                    ? 'text-green-700 bg-green-50 border-green-200'
                    : scoreGrade === 'B'
                    ? 'text-teal-700 bg-teal-50 border-teal-200'
                    : scoreGrade === 'C'
                    ? 'text-orange-700 bg-orange-50 border-orange-200'
                    : 'text-red-700 bg-red-50 border-red-200';

                const priorityBadge =
                  s.priority === 'P1'
                    ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                    : s.priority === 'P2'
                    ? 'bg-blue-100 text-blue-800 border-blue-200 font-medium'
                    : 'bg-gray-100 text-gray-600 border-gray-200';

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-indigo-50/70 transition-colors group ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => toggleSelectRow(s.id)} className="text-gray-400 hover:text-gray-900 cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    </td>

                    {/* Priority */}
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${priorityBadge}`}>
                        {s.priority}
                      </span>
                    </td>

                    {/* School Name & Code (Sticky if frozen) */}
                    <td
                      className={`py-2 px-3 ${
                        freezeColumn
                          ? 'sticky left-0 bg-white z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)] group-hover:bg-indigo-50/70'
                          : ''
                      }`}
                    >
                      <button
                        onClick={() => onSelectSchool(s.id)}
                        className="font-bold text-gray-900 hover:text-indigo-700 text-left block truncate max-w-[280px] cursor-pointer"
                        title={s.name}
                      >
                        {s.name}
                      </button>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono mt-0.5">
                        <span>{s.schoolCode}</span>
                        {s.contactsCount > 0 && (
                          <span className="text-green-700 font-sans">• {s.contactsCount} verified contacts</span>
                        )}
                      </div>
                    </td>

                    {/* Area & City */}
                    <td className="py-2 px-3 text-gray-800">
                      <div className="font-semibold truncate max-w-[120px]">{s.area}</div>
                      <div className="text-[10px] text-gray-500">{s.city}</div>
                    </td>

                    {/* Board */}
                    <td className="py-2 px-3 font-mono text-gray-700">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[11px] font-medium border border-gray-200">
                        {s.board}
                      </span>
                    </td>

                    {/* Student Strength */}
                    <td className="py-2 px-3 text-right font-mono text-gray-900 font-semibold">
                      {s.studentStrength.toLocaleString('en-IN')}
                    </td>

                    {/* Data Confidence Score */}
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border ${scoreColor}`}>
                          {s.dataConfidence}% ({scoreGrade})
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              s.dataConfidence >= 80 ? 'bg-green-600' : s.dataConfidence >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${s.dataConfidence}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Stage Dropdown (Inline Edit) */}
                    <td className="py-2 px-3">
                      <select
                        value={s.stage}
                        onChange={(e) => onStageChange(s.id, e.target.value as PipelineStage)}
                        className="bg-white border border-gray-300 hover:border-gray-400 rounded px-2 py-1 text-gray-800 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[160px] truncate shadow-xs"
                      >
                        {STAGE_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-white text-gray-800">
                            {st.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Follow-up / Last Activity */}
                    <td className="py-2 px-3 text-gray-600">
                      {s.nextFollowUpDate ? (
                        <div>
                          <div className="text-orange-700 font-mono text-[11px] font-bold">
                            {s.nextFollowUpDate}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {s.nextFollowUpAction || 'Callback'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">No active follow-up</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() =>
                            onQuickWhatsApp({
                              id: s.id,
                              name: s.name,
                              phone: s.officialPhone
                            })
                          }
                          className="p-1 rounded bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-200 transition-colors cursor-pointer"
                          title="Send One-Click WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onResearchSchool(s.id)}
                          className="p-1 rounded bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-colors cursor-pointer"
                          title="Run Web Research Crawler"
                        >
                          <Globe2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectSchool(s.id)}
                          className="p-1 rounded bg-gray-50 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                          title="Open School 360"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 select-none">
          <div>
            Showing <strong className="text-gray-900">{schools.length}</strong> of{' '}
            <strong className="text-gray-900">{totalSchools}</strong> schools
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none border border-gray-300 text-gray-700 flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="font-mono text-gray-700 px-2 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none border border-gray-300 text-gray-700 flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
