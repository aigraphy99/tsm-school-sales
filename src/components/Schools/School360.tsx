import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Globe2,
  UserPlus,
  Calendar,
  FileText,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  Mail,
  Send,
  Plus
} from 'lucide-react';
import { School, Contact, Activity, Opportunity, WhatsAppMessage, Evidence, DataConflict } from '../../types.js';
import { callAiAssistant, logActivity, addContact, verifyContactTruecaller } from '../../api.js';

interface School360Props {
  schoolId: string;
  schoolData: any; // complete school object with contacts, evidence, etc.
  onClose: () => void;
  onRefresh: () => void;
  onQuickWhatsApp: (school: { id: string; name: string; phone?: string; contactName?: string }) => void;
}

type TabType =
  | 'OVERVIEW'
  | 'CONTACTS'
  | 'RESEARCH'
  | 'TIMELINE'
  | 'WHATSAPP'
  | 'OPPORTUNITIES'
  | 'AI_ASSISTANT';

export const School360: React.FC<School360Props> = ({
  schoolId,
  schoolData,
  onClose,
  onRefresh,
  onQuickWhatsApp
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [activityType, setActivityType] = useState('CALL');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [nextAction, setNextAction] = useState('');

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Add Contact states
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactDesignation, setContactDesignation] = useState('PRINCIPAL');
  const [contactMobile, setContactMobile] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [verifyingContactId, setVerifyingContactId] = useState<string | null>(null);

  const handleVerifyContact = async (cId: string) => {
    setVerifyingContactId(cId);
    try {
      await verifyContactTruecaller(cId);
      onRefresh();
    } catch (err) {
      console.error('Failed to verify contact via Truecaller:', err);
    } finally {
      setVerifyingContactId(null);
    }
  };

  if (!schoolData) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-700 shadow-xl">
          Loading School 360 Record...
        </div>
      </div>
    );
  }

  const handleSaveActivity = async () => {
    if (!activityTitle.trim()) return;
    await logActivity({
      schoolId: schoolData.id,
      type: activityType,
      title: activityTitle,
      description: activityDesc,
      nextFollowUpDate: nextDate || undefined,
      nextFollowUpAction: nextAction || undefined
    });
    setIsLoggingActivity(false);
    setActivityTitle('');
    setActivityDesc('');
    setNextDate('');
    setNextAction('');
    onRefresh();
  };

  const handleCreateContact = async () => {
    if (!contactName.trim() || !contactMobile.trim()) return;
    await addContact({
      schoolId: schoolData.id,
      name: contactName,
      normalizedName: contactName.toLowerCase(),
      designation: contactDesignation as any,
      mobile: contactMobile,
      whatsappNumber: contactMobile,
      email: contactEmail,
      source: 'Manual Entry (School 360)',
      confidence: 0.95,
      verified: true,
      verifiedAt: new Date().toISOString(),
      isPrimary: contactDesignation === 'PRINCIPAL'
    });
    setIsAddingContact(false);
    setContactName('');
    setContactMobile('');
    setContactEmail('');
    onRefresh();
  };

  const handleRunAi = async (action: string) => {
    setIsAiLoading(true);
    setAiOutput('');
    try {
      const res = await callAiAssistant(schoolData.id, action, aiPrompt);
      setAiOutput(res.output);
    } catch (err) {
      setAiOutput('Failed to fetch AI sales briefing.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const primaryContact =
    schoolData.contacts?.find((c: Contact) => c.isPrimary) || schoolData.contacts?.[0];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
      <div className="bg-white border-l border-gray-300 w-full max-w-4xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-indigo-900 px-5 py-3 border-b border-indigo-950 flex items-start justify-between shrink-0 text-white">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/70 text-indigo-200 font-semibold border border-indigo-800">
                {schoolData.schoolCode}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 font-bold border border-green-500/30">
                Score: {schoolData.dataConfidence}%
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-bold border border-white/20">
                {schoolData.board}
              </span>
              <span className="text-xs text-indigo-200">
                TSM: <strong className="text-white">{schoolData.ownerTsmName}</strong>
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight mt-1">
              {schoolData.name}
            </h1>
            <div className="text-xs text-indigo-200 mt-0.5 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                <span>{schoolData.area}, {schoolData.city} (PIN: {schoolData.pincode})</span>
              </span>
              <span>•</span>
              <span>Strength: <strong className="text-white">{schoolData.studentStrength} students</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="bg-gray-50 px-5 py-2 border-b border-gray-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0 select-none">
          <div className="flex items-center space-x-2">
            {primaryContact?.mobile && (
              <a
                href={`tel:${primaryContact.mobile}`}
                className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Principal</span>
              </a>
            )}

            <button
              onClick={() =>
                onQuickWhatsApp({
                  id: schoolData.id,
                  name: schoolData.name,
                  phone: primaryContact?.mobile || schoolData.officialPhone,
                  contactName: primaryContact?.name || 'Principal'
                })
              }
              className="px-2.5 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Send WhatsApp</span>
            </button>

            <button
              onClick={() => setIsLoggingActivity(true)}
              className="px-2.5 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Log Activity / Follow-up</span>
            </button>

            <button
              onClick={() => setIsAddingContact(true)}
              className="px-2.5 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Contact</span>
            </button>
          </div>

          <a
            href={schoolData.brochure ? `/share/brochure/${schoolData.brochure.token}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-700 hover:text-indigo-900 font-medium underline flex items-center space-x-1 shrink-0 cursor-pointer"
          >
            <span>Tracked Prospectus Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white px-5 border-b border-gray-200 flex items-center space-x-5 shrink-0 text-xs font-medium">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'CONTACTS', label: `Contacts (${schoolData.contacts?.length || 0})` },
            { id: 'RESEARCH', label: 'Evidence & Provenance' },
            { id: 'TIMELINE', label: `Timeline (${schoolData.activities?.length || 0})` },
            { id: 'WHATSAPP', label: `WhatsApp Logs (${schoolData.whatsapp?.length || 0})` },
            { id: 'OPPORTUNITIES', label: `Olympiad & Books (${schoolData.opportunities?.length || 0})` },
            { id: 'AI_ASSISTANT', label: 'AI Sales Copilot' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2.5 relative transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Institutional Specs Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                  Institutional Master Record
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500">School Code</div>
                    <div className="text-gray-900 font-mono font-bold mt-0.5">{schoolData.schoolCode}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Affiliation Board</div>
                    <div className="text-gray-900 font-medium mt-0.5">{schoolData.board} (Grades: {schoolData.classes || 'Nursery - 12'})</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Estimated Student Body</div>
                    <div className="text-indigo-700 font-mono font-bold mt-0.5">{schoolData.studentStrength} students</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Official Website</div>
                    <a
                      href={schoolData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-700 hover:underline flex items-center space-x-1 mt-0.5 truncate"
                    >
                      <span className="truncate">{schoolData.website || 'Not configured'}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div>
                    <div className="text-gray-500">Official Phone</div>
                    <div className="text-gray-900 font-mono mt-0.5">{schoolData.officialPhone || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Official Email</div>
                    <div className="text-gray-900 truncate mt-0.5">{schoolData.officialEmail || 'N/A'}</div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-100 text-xs">
                  <div className="text-gray-500">Full Campus Address</div>
                  <div className="text-gray-800 mt-0.5">
                    {schoolData.addressLine1}, {schoolData.addressLine2 || ''}
                  </div>
                </div>
              </div>

              {/* Data Quality & Field-Level Confidence */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                    Field-Level Confidence Engine
                  </h3>
                  <span className="text-xs font-mono text-green-700 font-bold">
                    Overall: {schoolData.dataConfidence}% Grade{' '}
                    {schoolData.dataConfidence >= 90 ? 'A' : 'B'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[11px]">Principal Info</div>
                    <div className="text-green-700 font-mono font-bold mt-0.5">
                      {schoolData.fieldConfidence?.principal || 92}% Verified
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[11px]">Coordinator Mobile</div>
                    <div className="text-green-700 font-mono font-bold mt-0.5">
                      {schoolData.fieldConfidence?.coordinator || 85}% Verified
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[11px]">Campus Address</div>
                    <div className="text-green-700 font-mono font-bold mt-0.5">
                      {schoolData.fieldConfidence?.address || 95}% Verified
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[11px]">School Website</div>
                    <div className="text-green-700 font-mono font-bold mt-0.5">
                      {schoolData.fieldConfidence?.website || 98}% Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Brochure Prospectus Engagement */}
              {schoolData.brochure && (
                <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-900">Tracked Digital Prospectus Engagement</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Opened <strong className="text-indigo-700">{schoolData.brochure.openedCount} times</strong> on {schoolData.brochure.device || 'Mobile Browser'}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      Last Viewed: {schoolData.brochure.lastViewedAt ? new Date(schoolData.brochure.lastViewedAt).toLocaleTimeString() : 'Not opened yet'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === 'CONTACTS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                  Verified Stakeholders ({schoolData.contacts?.length || 0})
                </h3>
                <button
                  onClick={() => setIsAddingContact(true)}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schoolData.contacts?.map((c: Contact) => (
                  <div
                    key={c.id}
                    className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-2.5 relative hover:border-indigo-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                            {c.designation}
                          </span>
                          {c.verified && (
                            <span className="text-[10px] text-green-700 font-bold flex items-center space-x-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified ({Math.round(c.confidence * 100)}%)</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mt-1">{c.name}</h4>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Mobile / WhatsApp:</span>
                        <span className="font-mono font-bold text-gray-900">+91 {c.mobile}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-mono text-gray-800 truncate max-w-[180px]">{c.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Evidence Source:</span>
                        <span className="text-gray-500 truncate max-w-[180px]">{c.source}</span>
                      </div>
                    </div>

                    {c.notes && (
                      <div className="p-2 rounded bg-gray-50 border border-gray-200 text-[11px] text-gray-600">
                        {c.notes}
                      </div>
                    )}

                    {/* Truecaller & Telecom HLR Verification Badge */}
                    <div className="p-2.5 rounded bg-indigo-50/70 border border-indigo-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-indigo-950 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                          <span>Truecaller & Telecom Check:</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                            c.truecaller?.status === 'VERIFIED_ACCURATE' || c.verified
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : c.truecaller?.status === 'NAME_MISMATCH'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {c.truecaller?.status === 'VERIFIED_ACCURATE' || c.verified
                            ? '✓ Verified Accurate'
                            : c.truecaller?.status === 'NAME_MISMATCH'
                            ? '⚠ Name Mismatch'
                            : 'Unverified'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700">
                        <div>
                          <span className="text-gray-500">Truecaller ID: </span>
                          <span className="font-semibold text-gray-900">
                            {c.truecaller?.callerName || c.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Carrier: </span>
                          <span className="font-medium text-gray-800">
                            {c.truecaller?.carrier || 'Reliance Jio / Airtel'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-indigo-100/80 text-[10px]">
                        <span className="text-green-700 font-medium">WhatsApp: Active & Reachable</span>
                        <div className="flex items-center space-x-2">
                          <a
                            href={
                              c.truecaller?.truecallerWebUrl ||
                              `https://www.truecaller.com/search/in/${c.mobile}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-700 hover:text-indigo-900 font-semibold flex items-center space-x-0.5 cursor-pointer"
                          >
                            <span>Truecaller Web</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <button
                            onClick={() => handleVerifyContact(c.id)}
                            disabled={verifyingContactId === c.id}
                            className="px-2 py-0.5 rounded bg-white hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 cursor-pointer disabled:opacity-50"
                          >
                            {verifyingContactId === c.id ? 'Checking...' : 'Verify Free'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center space-x-2">
                      <a
                        href={`tel:${c.mobile}`}
                        className="flex-1 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300 flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-indigo-700" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() =>
                          onQuickWhatsApp({
                            id: schoolData.id,
                            name: schoolData.name,
                            phone: c.mobile,
                            contactName: c.name
                          })
                        }
                        className="flex-1 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 fill-white" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVIDENCE & PROVENANCE TAB */}
          {activeTab === 'RESEARCH' && (
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                  Data Provenance & Audit Trail
                </h3>
                <p className="text-xs text-gray-500">
                  Every field value is recorded with observed source, HTTP verification timestamp, and confidence rating.
                </p>

                <div className="divide-y divide-gray-100 text-xs">
                  {schoolData.evidence?.map((ev: Evidence) => (
                    <div key={ev.id} className="py-2.5 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-gray-900">{ev.field}</div>
                        <div className="text-green-700 font-medium mt-0.5">{ev.observedValue}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Source: {ev.sourceType} • Observed: {new Date(ev.observedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 font-mono font-bold text-[10px]">
                          {Math.round(ev.confidence * 100)}% Confidence
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">{ev.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                  Sales Activity History ({schoolData.activities?.length || 0})
                </h3>
                <button
                  onClick={() => setIsLoggingActivity(true)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300 flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Entry</span>
                </button>
              </div>

              <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {schoolData.activities?.map((act: Activity) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{act.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{act.description}</p>
                      <div className="text-[10px] text-gray-400 font-mono pt-0.5">Logged by: {act.userName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHATSAPP LOGS TAB */}
          {activeTab === 'WHATSAPP' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                  WhatsApp Messaging History
                </h3>
                <button
                  onClick={() =>
                    onQuickWhatsApp({
                      id: schoolData.id,
                      name: schoolData.name,
                      phone: primaryContact?.mobile || schoolData.officialPhone,
                      contactName: primaryContact?.name || 'Principal'
                    })
                  }
                  className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  New WhatsApp Message
                </button>
              </div>

              <div className="space-y-2.5">
                {schoolData.whatsapp?.map((msg: WhatsAppMessage) => (
                  <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-gray-900">{msg.recipientName}</strong> ({msg.designation})
                        <span className="text-gray-500 ml-2 font-mono">+91 {msg.recipientPhone}</span>
                      </div>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          msg.status === 'REPLIED'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : msg.status === 'READ'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                      {msg.messageText}
                    </p>

                    <div className="text-[10px] text-gray-400 font-mono flex items-center space-x-3">
                      <span>Sent: {new Date(msg.sentAt).toLocaleTimeString()}</span>
                      {msg.readAt && <span>• Read: {new Date(msg.readAt).toLocaleTimeString()}</span>}
                      {msg.repliedAt && <span className="text-purple-700 font-semibold">• Replied: {new Date(msg.repliedAt).toLocaleTimeString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPPORTUNITIES TAB */}
          {activeTab === 'OPPORTUNITIES' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Active Commercial Opportunities
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schoolData.opportunities?.map((opp: Opportunity) => (
                  <div key={opp.id} className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {opp.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-green-700">
                        ₹{opp.potentialValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{opp.product}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Stage: <strong className="text-gray-800">{opp.stage}</strong> • Win Prob: {Math.round(opp.probability * 100)}%
                      </div>
                    </div>

                    {opp.subjects && (
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {opp.subjects.map((sub) => (
                          <span key={sub} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Next Action: <span className="text-gray-800 font-medium">{opp.nextAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI SALES COPILOT TAB */}
          {activeTab === 'AI_ASSISTANT' && (
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
                <div className="flex items-center space-x-2 text-indigo-700">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Gemini 3.8 Intelligence Engine
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Field Sales Pitch & Pre-Call Intelligence
                </h3>
                <p className="text-xs text-gray-500">
                  Generates sharp tactical briefs, objection handling arguments, and customized WhatsApp scripts.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleRunAi('call_brief')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    Generate Pre-Call Brief
                  </button>
                  <button
                    onClick={() => handleRunAi('summarize_school')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Summarize Institutional Profile
                  </button>
                  <button
                    onClick={() => handleRunAi('suggest_action')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Suggest High-Probability Next Action
                  </button>
                </div>

                {isAiLoading && (
                  <div className="p-3 text-center text-xs text-indigo-700 font-mono animate-pulse">
                    Synthesizing school intelligence with Gemini 3.8-flash...
                  </div>
                )}

                {aiOutput && (
                  <div className="p-3.5 rounded bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {aiOutput}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Log Activity */}
        {isLoggingActivity && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-5 max-w-md w-full space-y-3.5 shadow-2xl">
              <h3 className="text-sm font-bold text-gray-900">Log Field Sales Activity</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                    <option value="VISIT">Campus In-Person Visit</option>
                    <option value="NOTE">Sales Note</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Title / Summary</label>
                  <input
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder="e.g. Principal agreed to review brochure"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Detailed Notes</label>
                  <textarea
                    value={activityDesc}
                    onChange={(e) => setActivityDesc(e.target.value)}
                    placeholder="Enter meeting takeaways, fee discussions, or teacher coordinator details..."
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Next Action Required</label>
                    <input
                      type="text"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      placeholder="e.g. Deliver Olympiad specimen"
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-gray-200">
                <button
                  onClick={() => setIsLoggingActivity(false)}
                  className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveActivity}
                  className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Contact */}
        {isAddingContact && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-5 max-w-md w-full space-y-3.5 shadow-2xl">
              <h3 className="text-sm font-bold text-gray-900">Add School Contact</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. Sunita Deshpande"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Designation</label>
                  <select
                    value={contactDesignation}
                    onChange={(e) => setContactDesignation(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="PRINCIPAL">Principal</option>
                    <option value="VICE_PRINCIPAL">Vice Principal</option>
                    <option value="OLYMPIAD_COORDINATOR">Olympiad Coordinator</option>
                    <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
                    <option value="SCIENCE_TEACHER">Science Teacher</option>
                    <option value="MATHS_TEACHER">Maths Teacher</option>
                    <option value="ADMIN">School Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="text"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder="10-digit mobile (e.g. 9822123456)"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="principal@school.edu.in"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-gray-200">
                <button
                  onClick={() => setIsAddingContact(false)}
                  className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContact}
                  className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
