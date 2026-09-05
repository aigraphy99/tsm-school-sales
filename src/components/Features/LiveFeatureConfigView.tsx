import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  User as UserIcon,
  Calculator,
  FileText,
  Send,
  ExternalLink,
  RefreshCw,
  Save,
  DollarSign,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import {
  fetchFeatureConfig,
  updateFeatureConfigApi,
  rollbackFeatureChange,
  executeAiLiveBotCommand
} from '../../api.js';
import { LiveFeatureConfig, LiveChangeRecord } from '../../types.js';

export const LiveFeatureConfigView: React.FC = () => {
  const [config, setConfig] = useState<LiveFeatureConfig | null>(null);
  const [history, setHistory] = useState<LiveChangeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form edit states
  const [tsmName, setTsmName] = useState<string>('');
  const [tsmPhone, setTsmPhone] = useState<string>('');
  const [baseFee, setBaseFee] = useState<number>(150);
  const [retention, setRetention] = useState<number>(25);
  const [deadline, setDeadline] = useState<string>('');
  const [pitchAmountInTemplates, setPitchAmountInTemplates] = useState<boolean>(false);

  // AI Live Bot states
  const [botCommand, setBotCommand] = useState<string>('');
  const [botExecuting, setBotExecuting] = useState<boolean>(false);
  const [botOutput, setBotOutput] = useState<{ text: string; success: boolean; change?: any } | null>(null);

  // Interactive Live Calculation state
  const [simStudents, setSimStudents] = useState<number>(200);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchFeatureConfig();
      if (res && res.config) {
        setConfig(res.config);
        setHistory(res.history || []);
        setTsmName(res.config.tsmName || 'Swapnil');
        setTsmPhone(res.config.tsmPhone || '+91 84481 99842');
        setBaseFee(res.config.baseFee || 150);
        setRetention(res.config.schoolRetentionPerStudent || 25);
        setDeadline(res.config.registrationDeadline || '30th / 31st September 2026');
        setPitchAmountInTemplates(res.config.pitchAmountInTemplates ?? false);
      }
    } catch (err) {
      console.error('Failed to load feature config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateFeatureConfigApi({
        updates: {
          tsmName,
          tsmPhone,
          baseFee: Number(baseFee),
          schoolRetentionPerStudent: Number(retention),
          littleStarRetention: Number(retention),
          registrationDeadline: deadline,
          pitchAmountInTemplates
        },
        author: 'Swapnil (TSM Nagpur)',
        title: 'Manual Live Settings Update',
        description: `Updated TSM: ${tsmName} (${tsmPhone}), Base: ₹${baseFee}, Retention: ₹${retention}/student`,
        category: 'GENERAL'
      });
      setConfig(res.config);
      await loadData();
      setStatusMessage({ text: 'Live configuration saved and published to public brochures & templates!', type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ text: `Failed to save: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAiBotSubmit = async (customCommand?: string) => {
    const cmd = customCommand || botCommand;
    if (!cmd.trim()) return;

    setBotExecuting(true);
    setBotOutput(null);
    try {
      const res = await executeAiLiveBotCommand(cmd, 'Swapnil (TSM Nagpur)');
      setBotOutput({
        text: res.message,
        success: res.success,
        change: res.changeRecord || res.revertedChange
      });
      if (res.config) {
        setConfig(res.config);
        setTsmName(res.config.tsmName);
        setTsmPhone(res.config.tsmPhone);
        setBaseFee(res.config.baseFee);
        setRetention(res.config.schoolRetentionPerStudent);
        setDeadline(res.config.registrationDeadline);
        setPitchAmountInTemplates(res.config.pitchAmountInTemplates);
      }
      await loadData();
      if (!customCommand) setBotCommand('');
    } catch (err: any) {
      setBotOutput({
        text: `Error executing AI bot directive: ${err.message}`,
        success: false
      });
    } finally {
      setBotExecuting(false);
    }
  };

  const handleRollback = async (changeId: string) => {
    try {
      const res = await rollbackFeatureChange(changeId, 'Swapnil (TSM Nagpur)');
      if (res.success) {
        setStatusMessage({ text: `Successfully reverted change!`, type: 'success' });
        await loadData();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      setStatusMessage({ text: `Rollback failed: ${err.message}`, type: 'error' });
    }
  };

  const foundationShare = baseFee - retention;
  const totalSimFee = simStudents * baseFee;
  const schoolSimRetention = simStudents * retention;
  const foundationSimRemittance = simStudents * foundationShare;

  if (loading && !config) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500 space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
        <span>Loading live feature settings and ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                Live Dynamic Engine
              </span>
              <span className="text-xs font-mono text-indigo-300">
                School Sales OS • Nagpur TSM Operations
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-400" />
              <span>AI Live Bot & Dynamic Feature Control Center</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Enables autonomous AI bot live modifications without limitation, verified fee calculations (<strong>₹25 retention per student</strong> retained directly by school), no fee pitch in templates, and an immutable audit ledger with instant rollback.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/share/brochure/sch-0001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Live Brochure (sch-0001)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 cursor-pointer"
              title="Refresh ledger"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-rose-50 text-rose-800 border border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-75 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Grid: AI Bot Console & Fee System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Autonomous AI Live Bot Console */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Bot Interactive Terminal */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900">
                    Autonomous AI Operations Bot
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Execute arbitrary live updates without limitation; changes are recorded and reversible
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                Open Access
              </span>
            </div>

            {/* Quick Directive Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Ensure retention is 25 per student',
                  'Update TSM phone to +91 84481 99842',
                  'Clean templates - do not pitch fee amount',
                  'Extend deadline till 30th/31st September 2026',
                  'Revert last change'
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAiBotSubmit(preset)}
                    disabled={botExecuting}
                    className="px-2.5 py-1 rounded bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 text-[11px] font-medium text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ⚡ {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Command Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800">
                Enter Directive for AI Bot:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={botCommand}
                  onChange={(e) => setBotCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !botExecuting) handleAiBotSubmit();
                  }}
                  placeholder="e.g. Set TSM phone to +91 84481 99842, ensure school retention is 25 per student"
                  className="flex-1 bg-gray-50 text-xs font-mono text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  disabled={botExecuting}
                />
                <button
                  onClick={() => handleAiBotSubmit()}
                  disabled={botExecuting || !botCommand.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                >
                  {botExecuting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Run Bot</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bot Execution Output */}
            {botOutput && (
              <div
                className={`p-3.5 rounded-lg text-xs border ${
                  botOutput.success
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                } space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {botOutput.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>AI Bot Execution Response:</span>
                </div>
                <p className="leading-relaxed pl-5 font-sans">{botOutput.text}</p>
                {botOutput.change && (
                  <div className="pl-5 pt-1 text-[11px] font-mono text-gray-600">
                    Recorded in Ledger as: <span className="font-bold text-gray-800">{botOutput.change.title}</span> (ID: {botOutput.change.id})
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form: Manual Live Settings Override */}
          <form onSubmit={handleManualSave} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-extrabold text-gray-900">
                  TSM Profile & Territory Settings (Nagpur)
                </h2>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">Editable by Admin / Swapnil</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">TSM Name:</label>
                <input
                  type="text"
                  value={tsmName}
                  onChange={(e) => setTsmName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">TSM Direct Mobile / WhatsApp:</label>
                <input
                  type="text"
                  value={tsmPhone}
                  onChange={(e) => setTsmPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-600"
                  required
                />
                <span className="text-[10px] text-gray-500">Official Nagpur TSM contact (+91 84481 99842)</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Olympiad Student Base Fee (INR):</label>
                <input
                  type="number"
                  value={baseFee}
                  onChange={(e) => setBaseFee(Number(e.target.value))}
                  min={50}
                  max={500}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                  required
                />
                <span className="text-[10px] text-gray-500">Standard fee per student (Class 1 to 12)</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-emerald-800">School Retained Share (Honorarium):</label>
                <input
                  type="number"
                  value={retention}
                  onChange={(e) => setRetention(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full bg-emerald-50 border border-emerald-300 rounded px-3 py-2 text-xs font-mono font-black text-emerald-800 focus:outline-none focus:border-emerald-600"
                  required
                />
                <span className="text-[10px] text-emerald-700 font-semibold">Strict mandate: ₹25 retained per student by school</span>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-700">Official Registration Deadline Notice:</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="sm:col-span-2 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-950 text-xs">Outreach Message Template Fee Policy:</div>
                  <div className="text-[11px] text-amber-800">
                    "Do not pitch fee amounts in outreach templates" (Directs schools to brochure & TSM instead)
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!pitchAmountInTemplates}
                    onChange={(e) => setPitchAmountInTemplates(!e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Live Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Live Fee Verification & Calculator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Fee Matrix Verification Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-extrabold text-gray-900">
                  Verified Fee & Honorarium Matrix
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                ₹25 School Retained
              </span>
            </div>

            {/* Matrix Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">Standard Olympiad (Class 1-12)</div>
                  <div className="text-[11px] text-gray-500">Maths, Science, English, AI, STEM, GK, etc.</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-extrabold text-sm text-gray-900">₹{baseFee}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">+₹{retention} retained</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-amber-950">Little Star (Nursery to UKG)</div>
                  <div className="text-[11px] text-amber-800">Includes Free 4-Item Art Kit for every child</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-extrabold text-sm text-amber-950">₹175</div>
                  <div className="text-[11px] text-emerald-700 font-bold">+₹{retention} retained</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-emerald-950">Specially-Abled & Martyrs' Children</div>
                  <div className="text-[11px] text-emerald-800">100% Free Foundation Scholarship</div>
                </div>
                <div className="text-right font-mono font-bold text-emerald-700">
                  ₹0 (FREE)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-blue-950">Level 2 & Level 3 Exams (ISRO Trip)</div>
                  <div className="text-[11px] text-blue-800">Zero extra fee for qualifying students</div>
                </div>
                <div className="text-right font-mono font-bold text-blue-700">
                  ₹0 (Sponsored)
                </div>
              </div>
            </div>

            {/* Interactive School Remittance Simulator */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Simulate School Participation:</span>
                <span className="text-xs font-mono font-extrabold text-indigo-700">{simStudents} Students</span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={simStudents}
                onChange={(e) => setSimStudents(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Total Collected</div>
                  <div className="font-mono font-extrabold text-gray-900 text-sm mt-0.5">₹{totalSimFee.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-300">
                  <div className="text-[10px] text-emerald-800 uppercase font-bold">School Retains</div>
                  <div className="font-mono font-black text-emerald-700 text-sm mt-0.5">₹{schoolSimRetention.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Remit to Trust</div>
                  <div className="font-mono font-extrabold text-gray-900 text-sm mt-0.5">₹{foundationSimRemittance.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Official SilverZone PDF Downloads */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-700" />
              <span>Official SilverZone Foundation PDFs (2026)</span>
            </h2>
            <div className="space-y-2 text-xs">
              <a
                href={config?.officialBrochurePdfUrl || 'https://service.silverzone.org/Files/demo/main/School_Brochure_Thin_2026.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50/40 flex items-center justify-between text-gray-800 transition-colors"
              >
                <span className="font-medium">📄 School_Brochure_Thin_2026.pdf</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
              <a
                href={config?.littleStarPdfUrl || 'https://service.silverzone.org/Files/demo/littlestar/Brochure_LittleStar_2026.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/40 flex items-center justify-between text-gray-800 transition-colors"
              >
                <span className="font-medium">⭐ Brochure_LittleStar_2026.pdf</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
              <a
                href={config?.posterPdfUrl || 'https://service.silverzone.org/Files/demo/main/Poster_A2.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 flex items-center justify-between text-gray-800 transition-colors"
              >
                <span className="font-medium">📌 Poster_A2.pdf (School Noticeboard)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Change History & Audit Ledger */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-gray-900">
              Live Change History Ledger & Audit Trail ({history.length} records)
            </h2>
          </div>
          <span className="text-[11px] text-gray-500">Every AI bot and user change is tracked with rollback capability</span>
        </div>

        {history.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-500">
            No live changes recorded yet. Changes made by the AI bot or admin will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Author</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Change Title & Details</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.slice(0, 30).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-2.5 font-bold whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.author.includes('AI')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {item.author}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-600 font-mono text-[10px] uppercase">
                      {item.category}
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-[11px] text-gray-500 line-clamp-2">{item.description}</div>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      {item.canRevert && (
                        <button
                          onClick={() => handleRollback(item.id)}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 border border-gray-200 text-[11px] font-bold flex items-center gap-1 ml-auto cursor-pointer transition-colors"
                          title="Rollback this change"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Revert</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
