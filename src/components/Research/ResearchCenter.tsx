import React, { useState, useEffect } from 'react';
import {
  Globe2,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Clock,
  Smartphone
} from 'lucide-react';
import { ResearchJob, DataConflict } from '../../types.js';
import {
  fetchResearchJobs,
  startBatchResearch,
  retryFailedResearch,
  fetchConflicts,
  resolveConflict
} from '../../api.js';
import { TruecallerAccuracyEngine } from './TruecallerAccuracyEngine.js';

interface ResearchCenterProps {
  onSelectSchool: (schoolId: string) => void;
  onQuickWhatsApp?: (target: { id: string; name: string; phone: string; contactName: string }) => void;
  initialSubTab?: 'TRUECALLER' | 'CRAWLER' | 'CONFLICTS';
}

export const ResearchCenter: React.FC<ResearchCenterProps> = ({
  onSelectSchool,
  onQuickWhatsApp = () => {},
  initialSubTab = 'TRUECALLER'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'TRUECALLER' | 'CRAWLER' | 'CONFLICTS'>(initialSubTab);
  const [jobs, setJobs] = useState<ResearchJob[]>([]);
  const [conflicts, setConflicts] = useState<DataConflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [j, c] = await Promise.all([fetchResearchJobs(), fetchConflicts()]);
      setJobs(j);
      setConflicts(c);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBatch = async () => {
    setIsLoading(true);
    await startBatchResearch(50);
    await loadData();
  };

  const handleRetryFailed = async () => {
    setIsLoading(true);
    await retryFailedResearch();
    await loadData();
  };

  const handleResolve = async (conflictId: string, resolution: 'KEEP_INTERNAL' | 'ACCEPT_WEB') => {
    await resolveConflict(conflictId, resolution);
    await loadData();
  };

  const pendingConflicts = conflicts.filter((c) => c.status === 'PENDING');

  const runningCount = jobs.filter((j) => j.status === 'RUNNING').length;
  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;
  const needsVerifCount = jobs.filter((j) => j.status === 'NEEDS_VERIFICATION').length;
  const failedCount = jobs.filter((j) => j.status === 'FAILED').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Sub-Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-1.5 flex items-center space-x-2 shadow-xs">
        <button
          onClick={() => setActiveSubTab('TRUECALLER')}
          className={`px-3 py-2 rounded text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === 'TRUECALLER'
              ? 'bg-green-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Truecaller & Telecom Number Accuracy</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            activeSubTab === 'TRUECALLER' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'
          }`}>
            Free Lookup
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('CRAWLER')}
          className={`px-3 py-2 rounded text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === 'CRAWLER'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Web Crawler & Affiliation Scraper</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            activeSubTab === 'CRAWLER' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-800'
          }`}>
            {jobs.length} Jobs
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('CONFLICTS')}
          className={`px-3 py-2 rounded text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
            activeSubTab === 'CONFLICTS'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Data Conflict Resolution</span>
          {pendingConflicts.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
              activeSubTab === 'CONFLICTS' ? 'bg-amber-700 text-white' : 'bg-red-100 text-red-800'
            }`}>
              {pendingConflicts.length} Pending
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'TRUECALLER' ? (
        <TruecallerAccuracyEngine
          onSelectSchool={onSelectSchool}
          onQuickWhatsApp={onQuickWhatsApp}
        />
      ) : (
        <>
          {/* Top Banner */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-indigo-700" />
              <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">
                Automated Web Crawler & Scraper Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 text-[10px] font-bold border border-green-200">
                SearXNG / CBSE Directory Multi-Source
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Field Verification & Research Center
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Continuously crawls official school domains, CBSE affiliation records, and local educational directories to discover Principal names, Olympiad Coordinators, and direct WhatsApp contacts.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleStartBatch}
              disabled={isLoading}
              className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Crawl Next 50 Schools</span>
            </button>

            {failedCount > 0 && (
              <button
                onClick={handleRetryFailed}
                disabled={isLoading}
                className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Failed ({failedCount})</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="p-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-gray-500">Total Scrape Jobs</div>
            <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">{jobs.length}</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-blue-600">Running Crawlers</div>
            <div className="text-lg font-bold text-blue-700 font-mono mt-0.5">{runningCount}</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-green-600">Completed & Verified</div>
            <div className="text-lg font-bold text-green-700 font-mono mt-0.5">{completedCount}</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-orange-600">Needs Review</div>
            <div className="text-lg font-bold text-orange-700 font-mono mt-0.5">{needsVerifCount}</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-red-600">Conflicts Detected</div>
            <div className="text-lg font-bold text-red-700 font-mono mt-0.5">{pendingConflicts.length}</div>
          </div>
        </div>
      </div>

      {/* Conflicts & Resolution Section (If any) */}
      {pendingConflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-900">
              Data Conflict Resolution Queue ({pendingConflicts.length})
            </h3>
          </div>
          <p className="text-xs text-red-800">
            The crawler found discrepancies between our database and the official school website. Review and accept web findings or retain existing data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {pendingConflicts.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-red-200 rounded-lg p-3 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{c.schoolName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 uppercase font-medium">
                    Field: {c.field}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-mono">Current Internal Value:</div>
                    <div className="font-semibold text-gray-800 mt-0.5">{c.existingValue || '(Empty)'}</div>
                  </div>
                  <div className="p-2 rounded bg-green-50 border border-green-200">
                    <div className="text-[10px] text-green-700 font-mono font-bold">Crawler Web Discovery:</div>
                    <div className="font-semibold text-green-900 mt-0.5">{c.webValue}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                  <span className="truncate max-w-[180px]">Source: {c.sourceUrl}</span>
                  <span className="font-mono text-green-700 font-bold shrink-0">
                    {Math.round(c.confidence * 100)}% Conf.
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleResolve(c.id, 'KEEP_INTERNAL')}
                    className="flex-1 py-1 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium cursor-pointer"
                  >
                    Keep Internal
                  </button>
                  <button
                    onClick={() => handleResolve(c.id, 'ACCEPT_WEB')}
                    className="flex-1 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Accept Web Value
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrape Jobs Detailed Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900">Crawler Execution Queue</h3>
          <span className="text-xs text-gray-500 font-mono">Showing {jobs.length} jobs</span>
        </div>

        <div className="divide-y divide-gray-100">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const statusColor =
              job.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : job.status === 'RUNNING'
                ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                : job.status === 'NEEDS_VERIFICATION'
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : 'bg-red-100 text-red-800 border-red-200';

            return (
              <div key={job.id} className="p-3 hover:bg-indigo-50/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <button
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSelectSchool(job.schoolId)}
                          className="font-bold text-xs text-gray-900 hover:text-indigo-700 text-left truncate cursor-pointer"
                        >
                          {job.schoolName}
                        </button>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${statusColor}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center space-x-2">
                        <span>Sources: {job.sourcesChecked?.length || 1}</span>
                        <span>•</span>
                        <span>Confidence: {Math.round((job.confidence || 0.85) * 100)}%</span>
                        <span>•</span>
                        <span className="font-mono">{new Date(job.startedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onSelectSchool(job.schoolId)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 shadow-xs cursor-pointer"
                    >
                      View 360
                    </button>
                  </div>
                </div>

                {/* Expanded Extracted Entities & Trace Logs */}
                {isExpanded && (
                  <div className="mt-2.5 pl-6 pr-1 space-y-2 text-xs animate-in fade-in">
                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200 space-y-2">
                      <div className="font-mono text-gray-600 text-[10px] uppercase font-bold">
                        Extracted Institutional Entities:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-gray-500">Principal: </span>
                          <span className="text-gray-900 font-medium">
                            {job.extractedData?.principalName || 'Not found'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Coordinator: </span>
                          <span className="text-gray-900 font-medium">
                            {job.extractedData?.coordinatorName || 'Not found'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Discovered Mobile: </span>
                          <span className="text-gray-900 font-mono font-medium">
                            {job.extractedData?.phone || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Discovered Email: </span>
                          <span className="text-gray-900 font-mono truncate">
                            {job.extractedData?.email || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Scraper Execution Logs */}
                      <div className="pt-2 border-t border-gray-200 font-mono text-[10px] text-gray-500 space-y-0.5">
                        {job.logs?.map((log, i) => (
                          <div key={i} className="leading-tight text-gray-600">
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
