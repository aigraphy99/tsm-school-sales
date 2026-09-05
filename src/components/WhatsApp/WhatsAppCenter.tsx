import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  FileText,
  Copy,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { WhatsAppMessage, MessageTemplate } from '../../types.js';
import { fetchWhatsAppMessages, fetchTemplates, simulateWhatsAppStatus } from '../../api.js';

interface WhatsAppCenterProps {
  onSelectSchool: (schoolId: string) => void;
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({ onSelectSchool }) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, t] = await Promise.all([fetchWhatsAppMessages(), fetchTemplates()]);
      setMessages(m);
      setTemplates(t);
      if (t.length > 0 && !selectedTemplate) {
        setSelectedTemplate(t[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateStatus = async (messageId: string, newStatus: string) => {
    await simulateWhatsAppStatus(messageId, newStatus);
    await loadData();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <span className="text-[10px] font-mono font-bold text-green-700 uppercase tracking-wider">
                Direct WhatsApp Communication Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 text-[10px] font-bold border border-green-200">
                1-Click Direct wa.me & Business API
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Sales Outreach & Template Manager
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Launch outreach to any verified Indian mobile number with zero setup. Track message status progression: Queued &rarr; Sent &rarr; Delivered &rarr; Read &rarr; Replied.
            </p>
          </div>

          <button
            onClick={loadData}
            className="p-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs flex items-center space-x-1.5 self-start cursor-pointer text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-gray-500">Total Outbound</div>
            <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">{messages.length}</div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-blue-600">Sent & Delivered</div>
            <div className="text-lg font-bold text-blue-700 font-mono mt-0.5">
              {messages.filter((m) => m.status === 'SENT' || m.status === 'DELIVERED').length}
            </div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-green-600">Read Receipts</div>
            <div className="text-lg font-bold text-green-700 font-mono mt-0.5">
              {messages.filter((m) => m.status === 'READ').length}
            </div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-purple-600">Inbound Replies</div>
            <div className="text-lg font-bold text-purple-700 font-mono mt-0.5">
              {messages.filter((m) => m.status === 'REPLIED').length}
            </div>
          </div>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
            <div className="text-[10px] font-bold uppercase text-orange-600">Active Templates</div>
            <div className="text-lg font-bold text-orange-700 font-mono mt-0.5">{templates.length}</div>
          </div>
        </div>
      </div>

      {/* Main 2-column: Left Templates, Right Outbound Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Templates List */}
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
            Standard Sales Templates ({templates.length})
          </h3>

          <div className="space-y-2">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{tpl.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                    {(tpl as any).content || (tpl as any).body}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedTemplate && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
              <div className="font-bold text-gray-900">Full Template Content:</div>
              <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-gray-700 font-sans leading-relaxed whitespace-pre-wrap">
                {(selectedTemplate as any).content || (selectedTemplate as any).body}
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                Variables: {'{{school_name}}, {{principal_name}}, {{city}}, {{tsm_name}}, {{brochure_url}}'}
              </div>
            </div>
          )}
        </div>

        {/* Outbound Messages Feed & Webhook Simulator */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
              Outreach Log & Status Inspector
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              Live status sync
            </span>
          </div>

          <div className="space-y-2.5">
            {messages.map((msg) => {
              const statusColor =
                msg.status === 'REPLIED'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : msg.status === 'READ'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : msg.status === 'DELIVERED'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200';

              return (
                <div
                  key={msg.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 hover:border-gray-300 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">{msg.recipientName}</span>
                        <span className="text-[11px] text-gray-500">({msg.designation})</span>
                        <span className="text-xs font-mono text-green-700 font-bold">
                          +91 {msg.recipientPhone}
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectSchool(msg.schoolId)}
                        className="text-xs text-indigo-700 hover:underline font-medium text-left mt-0.5 cursor-pointer"
                      >
                        {msg.schoolName}
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-100 leading-relaxed font-sans">
                    {msg.messageText}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px]">
                    <div className="text-gray-400 font-mono space-x-2 text-[10px]">
                      <span>Sent: {new Date(msg.sentAt).toLocaleTimeString()}</span>
                      {msg.readAt && <span>• Read: {new Date(msg.readAt).toLocaleTimeString()}</span>}
                      {msg.repliedAt && <span className="text-purple-700 font-bold">• Replied: {new Date(msg.repliedAt).toLocaleTimeString()}</span>}
                    </div>

                    {/* Webhook Status Simulator Buttons */}
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 text-[10px] mr-1">Simulate Webhook:</span>
                      <button
                        onClick={() => handleSimulateStatus(msg.id, 'DELIVERED')}
                        className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] border border-gray-200 cursor-pointer"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleSimulateStatus(msg.id, 'READ')}
                        className="px-1.5 py-0.5 rounded bg-green-50 text-green-800 hover:bg-green-100 text-[10px] border border-green-200 cursor-pointer"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleSimulateStatus(msg.id, 'REPLIED')}
                        className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 hover:bg-purple-100 text-[10px] border border-purple-200 cursor-pointer"
                      >
                        Replied
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
