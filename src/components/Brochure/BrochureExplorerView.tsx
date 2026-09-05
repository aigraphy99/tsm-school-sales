import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Rocket,
  Award,
  Sparkles,
  Calendar,
  Gift,
  ExternalLink,
  Copy,
  CheckCircle2,
  Send,
  AlertCircle,
  Building2,
  Share2,
  FileText,
  Search,
  Calculator,
  Phone
} from 'lucide-react';
import { School, LiveFeatureConfig } from '../../types.js';
import { fetchFeatureConfig } from '../../api.js';

interface BrochureExplorerViewProps {
  schools: School[];
  onQuickWhatsApp: (school: { id: string; name: string; phone?: string; contactName?: string; designation?: string }) => void;
}

export const BrochureExplorerView: React.FC<BrochureExplorerViewProps> = ({
  schools,
  onQuickWhatsApp
}) => {
  const [activeTab, setActiveTab] = useState<'BROCHURE' | 'LITTLE_STAR' | 'DATES' | 'FEES' | 'TEMPLATES'>('BROCHURE');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [schoolFilter, setSchoolFilter] = useState<string>('');
  const [config, setConfig] = useState<LiveFeatureConfig | null>(null);
  const [simCount, setSimCount] = useState<number>(200);

  useEffect(() => {
    fetchFeatureConfig()
      .then((res) => {
        if (res?.config) setConfig(res.config);
      })
      .catch((err) => console.error('Error fetching live config in explorer:', err));
  }, []);

  const retention = config?.schoolRetentionPerStudent || 25;
  const baseFee = config?.baseFee || 150;
  const tsmName = config?.tsmName || 'Swapnil';
  const tsmPhone = config?.tsmPhone || '+91 84481 99842';
  const deadline = config?.registrationDeadline || '30th / 31st September 2026';

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];
  const schoolName = selectedSchool?.name || 'Selected School';
  const principalContact = selectedSchool?.contacts?.find((c) => c.designation === 'PRINCIPAL');
  const principalName = principalContact?.name || 'Principal';
  const primaryPhone = principalContact?.phone || selectedSchool?.phone || '';

  const publicBrochureUrl = selectedSchool
    ? `${window.location.origin}/share/brochure/${selectedSchool.id}`
    : `${window.location.origin}/share/brochure/sch-0001`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDispatch = (templateId: string) => {
    if (selectedSchool) {
      onQuickWhatsApp({
        id: selectedSchool.id,
        name: selectedSchool.name,
        phone: primaryPhone,
        contactName: principalName,
        designation: 'PRINCIPAL'
      });
    }
  };

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolFilter.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolFilter.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Top Banner: Deadline Extension Notice */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-xl p-4 text-white shadow-md border border-red-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                Official Foundation Directive
              </span>
              <span className="text-xs font-bold text-amber-200">
                25th Silver Jubilee Celebrations (1998-2026)
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black tracking-tight flex items-center space-x-2">
              <span>📢 Registration Date Extended Till 30th / 31st September 2026!</span>
            </h1>
            <p className="text-xs text-red-100 max-w-3xl leading-relaxed">
              In response to official requests from school principals and academic coordinators across Nagpur & nationwide, SilverZone Foundation has officially extended the registration cutoff for all 12 Olympiads and the Little Star Olympiad.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={publicBrochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-red-50 text-red-700 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Open Public Prospectus</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Control Bar: School Context Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-lg">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-semibold text-gray-700 shrink-0">Target Outreach School:</span>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="w-full bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-900 border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            {schools.slice(0, 100).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city}) - {s.stage}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500">
            Principal: <strong>{principalName}</strong> ({primaryPhone || 'No Phone'})
          </span>
          <button
            onClick={() => handleDispatch('tmpl-sz-ext-main')}
            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>1-Click WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center space-x-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'BROCHURE', label: 'SilverZone Jubilee (12 Subjects & ISRO)' },
          { id: 'LITTLE_STAR', label: '⭐ Little Star (Nursery to UKG)' },
          { id: 'DATES', label: 'Examination Schedule 2026-27' },
          { id: 'FEES', label: `Fee & School Retention Matrix (+₹${retention})` },
          { id: 'TEMPLATES', label: 'WhatsApp Outreach Templates (No Fee Pitch)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#990033] text-[#990033]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeTab === 'BROCHURE' && (
        <div className="space-y-4">
          {/* ISRO & NASA Hero Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px] border border-sky-400/30">
                  <Rocket className="w-3.5 h-3.5 text-sky-400" />
                  <span>LEVEL 3 WINNER DESTINATION</span>
                </div>
                <h2 className="text-xl font-black text-white">
                  🚀 Educational Visit to ISRO (Indian Space Research Organisation)
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Third-level first-rank holders from Classes 6 to 12 in Mathematics (iOM), Science (iOS), and English (iOEL) scoring minimum 75% marks will receive an all-expenses-paid educational study visit to ISRO. Top international winners also travel on study tours to NASA (USA) and the UK!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                  <div className="text-amber-400 font-extrabold text-xl font-mono">₹7.4 Cr</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Awards</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                  <div className="text-emerald-400 font-extrabold text-xl font-mono">₹1,00,000</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">1st Prize Cash</div>
                </div>
              </div>
            </div>
          </div>

          {/* 12 Subjects Grid */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-gray-900">
              12 International Olympiad Subjects (Session 2026-27)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { code: 'iOM', name: 'Mathematics Olympiad', prize: '1st Prize: ₹1,00,000', range: 'Classes 1 to 12' },
                { code: 'iOS', name: 'Science Olympiad', prize: 'ISRO Educational Visit', range: 'Classes 1 to 12' },
                { code: 'iOEL', name: 'English Language Olympiad', prize: 'Global Benchmarking', range: 'Classes 1 to 12' },
                { code: 'iAIO', name: 'Artificial Intelligence Olympiad', prize: 'NEW LAUNCH 2026-27', range: 'Classes 3 to 12', highlight: true },
                { code: 'STEM', name: 'STEM Innovation Olympiad', prize: 'Robotics & Innovation', range: 'Classes 3 to 10' },
                { code: 'iCSO', name: 'Computer Science Olympiad', prize: 'Cyber & Coding Skills', range: 'Classes 1 to 12' },
                { code: 'iTHO', name: 'Talent Hunt Olympiad', prize: 'Maths, Science & Reasoning', range: 'Classes 1 to 10' },
                { code: 'iRAO', name: 'Reasoning & Aptitude', prize: 'Cognitive & Mental Ability', range: 'Classes 3 to 12' },
                { code: 'SKGKO', name: 'Smart Kid GK Olympiad', prize: 'Current Affairs & GK', range: 'Classes 1 to 10' },
                { code: 'iSSO', name: 'Social Studies Olympiad', prize: 'History, Civics & Geo', range: 'Classes 3 to 10' },
                { code: 'ABHO', name: 'Akhil Bhartiya Hindi', prize: 'Hindi Vyakaran & Bhasha', range: 'Classes 1 to 10' },
                { code: 'iSCO', name: 'ICSI Commerce Olympiad', prize: '1st Prize: ₹50,000', range: 'Classes 11 & 12' }
              ].map((subj) => (
                <div
                  key={subj.code}
                  className={`p-3 rounded-lg border transition-all ${
                    subj.highlight
                      ? 'border-emerald-300 bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-extrabold text-[11px]">
                      {subj.code}
                    </span>
                    {subj.highlight && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[9px] uppercase">
                        New Launch
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-gray-900 text-xs">{subj.name}</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">{subj.prize}</div>
                  <div className="text-[10px] text-gray-500">{subj.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RealMetrics & Udaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>RealMetrics™ Olympiad Diagnostic Report</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Empowering school leadership with class-by-class cognitive strengths, regional & national percentile analytics, and syllabus gap diagnostic indices. Provided free for registered schools.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>18th Educators Achievement Awards</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recognising dedicated educationalists. Best Principal: ₹20,000 + Trophy. Best Teacher: ₹10,000 + Trophy. Plus SGCS Girl Child Scholarship (₹5,000 for 100 students) and 100% free teacher ward participation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LITTLE STAR TAB */}
      {activeTab === 'LITTLE_STAR' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⭐</span>
                <h3 className="text-base font-extrabold text-amber-950">
                  Little Star Olympiad 2026-27 (Pre-Primary)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                  Nursery, LKG & UKG
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800">NEP 2020 ECCE Aligned</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Specially curated assessments fostering early cognitive curiosity, observation, and joyful exploration. No pressure, only recognition!
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
              <Gift className="w-5 h-5 text-emerald-700" />
              <span>🎁 Free Assured Learning Gift Kit for EVERY Enrolled Child:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center font-bold text-emerald-900 shadow-2xs">
                Pack of Sketch Pens
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center font-bold text-emerald-900 shadow-2xs">
                Box of Wax Crayons
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center font-bold text-emerald-900 shadow-2xs">
                Colour Pencils Set
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center font-bold text-emerald-900 shadow-2xs">
                Creative Activity Kit
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-900">Pre-Primary Subjects</h4>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Mathematics (Foundational numeracy & shapes)</li>
                <li>English (Phonics, letters & early vocabulary)</li>
                <li>EVS (Animals, plants, everyday environment)</li>
                <li>Hindi (Varnamala & picture associations)</li>
                <li>Drawing (*New - Creativity, colors & line work)</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-900">Fee Structure & Honorarium</h4>
              <div className="text-xs space-y-1.5">
                <div>Participation Fee: <strong className="font-mono text-sm">₹175</strong> per child</div>
                <div className="text-emerald-700 font-bold">School Retention: +₹25 per child for teacher honorarium</div>
                <div className="text-red-700 font-bold">Registration Extended Till: 30th/31st September 2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DATES TAB */}
      {activeTab === 'DATES' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-gray-900">
              Examination Schedules (2026-27 Session) - Choose Any 1 Date
            </h3>
            <span className="text-[11px] font-mono text-gray-500">Dates format: DD-MM-YYYY</span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-3">Olympiad Subject</th>
                  <th className="p-3">First Date</th>
                  <th className="p-3">Second Date</th>
                  <th className="p-3">Third Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono">
                {[
                  { name: 'International Olympiad of Mathematics (iOM)', d1: '08-10-2026', d2: '18-11-2026', d3: '07-12-2026' },
                  { name: 'International Olympiad of Science (iOS)', d1: '14-10-2026', d2: '19-11-2026', d3: '08-12-2026' },
                  { name: 'International Olympiad of English (iOEL)', d1: '21-10-2026', d2: '26-11-2026', d3: '10-12-2026' },
                  { name: 'International Computer Science (iCSO)', d1: '24-09-2026', d2: '22-10-2026', d3: '25-11-2026' },
                  { name: 'Smart Kid G.K. Olympiad (SKGKO)', d1: '28-09-2026', d2: '27-10-2026', d3: '30-11-2026' },
                  { name: 'Social Studies Olympiad (iSSO)', d1: '29-09-2026', d2: '28-10-2026', d3: '01-12-2026' },
                  { name: 'Reasoning & Aptitude Olympiad (iRAO)', d1: '30-09-2026', d2: '02-11-2026', d3: '02-12-2026' },
                  { name: 'STEM Innovation Olympiad', d1: '01-10-2026', d2: '03-11-2026', d3: '03-12-2026' },
                  { name: 'ICSI Commerce Olympiad (iSCO)', d1: '05-10-2026', d2: '04-11-2026', d3: '07-12-2026' },
                  { name: 'Talent Hunt Olympiad (iTHO)', d1: '05-10-2026', d2: '04-11-2026', d3: '14-12-2026' },
                  { name: 'Akhil Bhartiya Hindi (ABHO)', d1: '06-10-2026', d2: '05-11-2026', d3: '17-12-2026' },
                  { name: 'Artificial Intelligence Olympiad (iAIO)', d1: '07-10-2026', d2: '23-11-2026', d3: '21-12-2026' }
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-gray-50">
                    <td className="p-3 font-sans font-medium text-gray-900">{row.name}</td>
                    <td className="p-3 text-indigo-700 font-bold">{row.d1}</td>
                    <td className="p-3 text-blue-700 font-bold">{row.d2}</td>
                    <td className="p-3 text-purple-700 font-bold">{row.d3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FEES TAB */}
      {activeTab === 'FEES' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-gray-900">
                Official Fee & School Retained Honorarium Matrix
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                School directly retains ₹{retention} per student towards faculty coordinator honorarium and logistics.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs font-mono">
              +₹{retention}/student Retained
            </span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-3">Olympiad Category</th>
                  <th className="p-3">Base Fee (INR)</th>
                  <th className="p-3">School Retains (Honorarium)</th>
                  <th className="p-3">SilverZone Remittance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 font-semibold">Standard Olympiads (Maths, Science, English, AI, Computer, GK, Hindi, SST)</td>
                  <td className="p-3 font-mono font-bold">₹{baseFee}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">+₹{retention} / student</td>
                  <td className="p-3 font-mono font-bold text-gray-800">₹{baseFee - retention} / student</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Little Star (Pre-Primary Nursery, LKG, UKG)</td>
                  <td className="p-3 font-mono font-bold">₹175</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">+₹{retention} / student</td>
                  <td className="p-3 font-mono font-bold text-gray-800">₹150 (Includes 4 Art Kits)</td>
                </tr>
                <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                  <td className="p-3">Specially-Abled Students & Defence Martyrs' Children</td>
                  <td className="p-3 font-mono text-emerald-700">₹0 (100% Free)</td>
                  <td className="p-3 text-emerald-800">100% Waived</td>
                  <td className="p-3 text-emerald-700">₹0 (Full Scholarship)</td>
                </tr>
                <tr className="bg-blue-50/60 font-bold text-blue-950">
                  <td className="p-3">Level 2 & Level 3 Examinations (ISRO Tour)</td>
                  <td className="p-3 font-mono text-blue-700">₹0 (No Extra Cost)</td>
                  <td className="p-3 text-blue-800">Zero Charge</td>
                  <td className="p-3 text-blue-700">Fully Funded by Trust</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Retention Simulator */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>School Retention & Remittance Simulator for {schoolName}:</span>
              </span>
              <span className="font-mono font-black text-indigo-700 text-sm">{simCount} Students</span>
            </div>
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={simCount}
              onChange={(e) => setSimCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Collected</div>
                <div className="font-mono font-bold text-gray-900 mt-0.5 text-sm">₹{(simCount * baseFee).toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <div className="text-[10px] text-emerald-800 uppercase font-bold">Retained by {schoolName}</div>
                <div className="font-mono font-black text-emerald-700 mt-0.5 text-base">₹{(simCount * retention).toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Remit to Foundation</div>
                <div className="font-mono font-bold text-gray-900 mt-0.5 text-sm">₹{(simCount * (baseFee - retention)).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Official PDF Downloads */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
            <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">Official Foundation Documents (Direct PDF Links):</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://service.silverzone.org/Files/demo/main/School_Brochure_Thin_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold flex items-center gap-1.5 border border-rose-200"
              >
                <span>School_Brochure_Thin_2026.pdf</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://service.silverzone.org/Files/demo/littlestar/Brochure_LittleStar_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold flex items-center gap-1.5 border border-amber-200"
              >
                <span>Brochure_LittleStar_2026.pdf</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://service.silverzone.org/Files/demo/main/Poster_A2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-semibold flex items-center gap-1.5 border border-indigo-200"
              >
                <span>Poster_A2.pdf</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES TAB (NO FEE AMOUNT PITCHED) */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold uppercase font-mono tracking-wider text-gray-900">
                SilverZone Outreach Templates (Value & Academic Impact Focused)
              </h3>
              <p className="text-[11px] text-gray-500">
                Compliant with outreach policy: No upfront fee pitch. Directly guides {schoolName} to their personalized brochure and TSM consultation.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Compliant
            </span>
          </div>

          {[
            {
              id: 'tmpl-sz-ext-main',
              title: '📢 1. SilverZone 2026-27 Brochure & Extension Notice (Main)',
              category: 'BROCHURE_EXTENSION',
              text: `Respected ${principalName}, Greetings from SilverZone Foundation (25th Silver Jubilee Year). We are pleased to share the official 2026-27 Olympiad Information Brochure for ${schoolName}.\n\n📢 IMPORTANT UPDATE: Registration deadline for all 12 Olympiads has been officially EXTENDED TILL ${deadline.toUpperCase()}!\n\n🌟 Key Academic & Institutional Benefits:\n• 12 Subjects: Maths (iOM), Science (iOS), English (iOEL), STEM, Computer (iCSO), Talent Hunt (iTHO), Hindi (ABHO), Social Studies (iSSO), Reasoning (iRAO), GK (SKGKO), Commerce (iSCO) & AI (iAIO)\n• 1st Prize: ₹1,00,000 (Total awards worth ₹7.4 Crores!)\n• All Level 3 winners win an educational visit to ISRO & international study tours (NASA/UK)\n• No additional fee for Level 2 & Level 3\n• School retention allowance provided for faculty in-charge honorarium & exam logistics\n• RealMetrics™ comprehensive student benchmarking report for school management\n\nView official 2026-27 prospectus & date schedule: ${publicBrochureUrl}\n\nOur Territory Sales Manager for Nagpur (${tsmName}, ${tsmPhone}) can deliver registration forms directly to your campus this week. Would tomorrow or Thursday suit you?`
            },
            {
              id: 'tmpl-sz-ext-littlestar',
              title: '⭐ 2. Little Star Olympiad (Nursery to UKG) - Extended Deadline',
              category: 'LITTLE_STAR',
              text: `Dear Coordinator, SilverZone Foundation announces the Little Star Olympiad 2026-27 for Nursery, LKG & UKG students at ${schoolName} (NEP 2020 ECCE aligned).\n\n⏰ DEADLINE EXTENSION: Registration cutoff officially EXTENDED TILL ${deadline.toUpperCase()}!\n\n🎨 Exciting Participant Highlights:\n• Foundational Subjects: Mathematics, English, EVS, Hindi & Drawing (*New)\n• 🎁 Assured Gift Kit: Free Sketch Pens, Wax Crayons, Colour Pencils & Activity Kit for EVERY participating child!\n• Participation certificate for all + Medals for class toppers (>50%) & Distinction gifts (>75%)\n• School retention allowance included for teacher in-charge honorarium\n\nView prospectus & schedules: ${publicBrochureUrl}\n\nFeel free to connect directly with our Nagpur TSM (${tsmName}, ${tsmPhone}) to reserve student kits.`
            },
            {
              id: 'tmpl-sz-ext-urgent',
              title: '🚨 3. Urgent Principal Alert - Registration Extension Notice',
              category: 'URGENT_DEADLINE',
              text: `Respected ${principalName}, following requests from school heads across Nagpur, SilverZone Foundation has officially extended the Olympiad registration cutoff till ${deadline.toUpperCase()} for ${schoolName}.\n\nLeading CBSE institutions in the Nagpur cluster have already locked their Olympiad exam slots. By confirming before ${deadline}:\n1. Students compete for ₹7.4 Crore awards & ISRO space research educational visits\n2. 100% Free scholarship for Specially-abled students & Defence martyrs' children\n3. Outstanding Scholar Award (OSA): ₹5,000 scholarship + Trophy\n4. Retained school coordination honorarium included\n\nOfficial Digital Brochure: ${publicBrochureUrl}\n\nCan we reserve participant kits for ${schoolName}? Nagpur TSM Contact: ${tsmName} (${tsmPhone}).`
            },
            {
              id: 'tmpl-sz-ext-educators',
              title: '🏆 4. 18th Educators Achievement Awards & Udaan Initiatives',
              category: 'EDUCATOR_RECOGNITION',
              text: `Dear Principal, celebrating 25 years, SilverZone Foundation invites ${schoolName} to nominate educators for the 18th Educators Achievement Awards (Best Principal: ₹20,000 + Trophy; Best Teacher: ₹10,000 + Trophy) and IMPACT Educationist Award.\n\n🕊️ Udaan Welfare Initiatives:\n• 100% FREE participation for teachers' children in Maths & Science Olympiads\n• Free AI Olympiad (iAIO) entry for Economically Weaker Section (EWS) students\n• SGCS Girl Child Scholarship: ₹5,000 for 100 meritorious female students\n\nRegistration deadline extended till ${deadline}. View details: ${publicBrochureUrl}\nContact: ${tsmName} (${tsmPhone}).`
            },
            {
              id: 'tmpl-sz-ext-realmetrics',
              title: '🤖 5. RealMetrics™ & AI Olympiad (iAIO) Launch',
              category: 'AI_OLYMPIAD',
              text: `Respected Principal, introduce cutting-edge diagnostic assessments to ${schoolName} students with SilverZone's new International Artificial Intelligence Olympiad (iAIO) and RealMetrics™ Olympiad Benchmarking Report for 2026-27.\n\n📅 Multiple exam dates available across October, November & December 2026.\n📢 School registration has been extended till ${deadline}.\n\nRealMetrics™ provides your school management with class-wise cognitive strengths, national percentile rankings, and curriculum gap analysis. View the 2026-27 brochure here: ${publicBrochureUrl}\nNagpur TSM: ${tsmName} (${tsmPhone}).`
            }
          ].map((tpl) => (
            <div key={tpl.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-gray-900 text-xs">{tpl.title}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(tpl.text, tpl.id)}
                    className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDispatch(tpl.id)}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs font-sans text-gray-800 whitespace-pre-wrap leading-relaxed">
                {tpl.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
