import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, User, Calendar, Database } from 'lucide-react';
import { AuditLogItem } from '../../types.js';
import { fetchAuditLogs } from '../../api.js';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAuditLogs();
      setLogs(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-green-700" />
            <span className="text-[10px] font-mono font-bold text-green-800 uppercase tracking-wider">
              Governance & Compliance
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
            System Activity Audit Trail
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable log of all data modifications, crawler runs, WhatsApp touches, and stage transitions.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs flex items-center space-x-1.5 cursor-pointer text-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="divide-y divide-gray-100">
          {logs.map((log) => (
            <div key={log.id} className="p-3 hover:bg-indigo-50/40 transition-colors flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-900">{log.action}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                    {log.entityType}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{log.details}</p>
                <div className="text-[11px] text-gray-500 font-mono">
                  Actor: <strong className="text-gray-800">{log.userName}</strong>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-gray-400 shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-400 italic">
              No audit logs captured yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
