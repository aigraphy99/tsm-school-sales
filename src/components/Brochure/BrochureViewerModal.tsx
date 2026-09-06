import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Rocket,
  Award,
  Calendar,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  MessageSquare,
  BookOpen,
  Send,
  Download,
  AlertCircle,
  Gift,
  Calculator,
  Phone
} from 'lucide-react';
import { fetchFeatureConfig } from '../../api.js';
import { LiveFeatureConfig } from '../../types.js';

interface BrochureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWhatsApp?: (templateId: string) => void;
  targetSchoolName?: string;
  targetSchoolId?: string;
}

export const BrochureViewerModal: React.FC<BrochureViewerModalProps> = ({
  isOpen,
  onClose,
  onLaunchWhatsApp,
  targetSchoolName = 'Your School',
  targetSchoolId
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'BROCHURE' | 'LITTLE_STAR' | 'DATES' | 'FEES' | 'TEMPLATES'>('BROCHURE');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [config, setConfig] = useState<LiveFeatureConfig | null>(null);
  const [simCount, setSimCount] = useState<number>(200);

  useEffect(() => {
    if (isOpen) {
      fetchFeatureConfig()
        .then((res) => {
          if (res?.config) setConfig(res.config);
        })
        .catch((err) => console.error('Error fetching live config:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const retention = config?.schoolRetentionPerStudent || 25;
  const baseFee = config?.baseFee || 200;
  const tsmName = config?.tsmName || 'Swapnil';
  const tsmPhone = config?.tsmPhone || '+91 84481 99842';
  const deadline = config?.registrationDeadline || '30th Sept 2026';

  const brochureUrl = targetSchoolId
    ? `${window.location.origin}/share/brochure/${targetSchoolId}`
    : `${window.location.origin}/share/brochure/sch-0001`;

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#990033] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-200 uppercase">
                  SilverZone Foundation (25th Silver Jubilee)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                  Extended to 30th Sept
                </span>
              </div>
              <h2 className="text-base font-extrabold tracking-tight text-white mt-0.5">
                Official Information Brochure & Outreach Assets 2026-27
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              <span>Public Live View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button onClick={onClose} className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Extension Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 border-b border-red-500 shadow-inner">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-xs font-bold">
              📢 Official Notification: Registration Date Officially Extended Till <span className="underline decoration-amber-300 font-black">30th Sept 2026</span>
            </span>
          </div>
          <span className="text-[11px] bg-red-800/80 border border-red-400/40 px-2.5 py-0.5 rounded-full font-mono font-medium self-start sm:self-auto">
            Applicable for all 330 Nagpur CBSE Schools
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 flex items-center space-x-3 text-xs font-semibold overflow-x-auto shrink-0">
          {[
            { id: 'BROCHURE', label: 'SilverZone Jubilee (12 Olympiads & ISRO)' },
            { id: 'LITTLE_STAR', label: '⭐ Little Star (Nursery to UKG)' },
            { id: 'DATES', label: 'Exam Dates 2026-27' },
            { id: 'FEES', label: `Fee & School Retention (+₹${retention})` },
            { id: 'TEMPLATES', label: 'WhatsApp Outreach Templates (No Fee Pitch)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2.5 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-[#990033] text-[#990033] font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-gray-800 text-xs leading-relaxed">
          {/* TAB 1: SILVERZONE 2026-27 BROCHURE OVERVIEW */}
          {activeSubTab === 'BROCHURE' && (
            <div className="space-y-4">
              {/* Grand ISRO & NASA Trip Hero */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-400/30">
                      <Rocket className="w-3 h-3 text-sky-400 mr-1" />
                      LEVEL 3 GRAND REWARD
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      All-Expenses-Paid Educational Visit to ISRO (Space Research)
                    </h3>
                    <p className="text-slate-300 text-xs max-w-xl">
                      Level 3 first-rank holders from Classes 6 to 12 in Mathematics (iOM), Science (iOS), and English (iOEL) with 75%+ marks receive an educational tour to ISRO. International winners also visit NASA (USA) and the UK!
                    </p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-right shrink-0">
                    <div className="text-amber-400 font-extrabold text-lg font-mono">₹7.4 Crores</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Prize Pool</div>
                  </div>
                </div>
              </div>

              {/* 12 Subjects Grid */}
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase font-mono tracking-wider mb-2.5">
                  12 International Olympiad Subjects (Session 2026-27)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {[
                    { code: 'iOM', name: 'Mathematics', desc: 'Classes 1-12 | ₹1 Lakh 1st Prize' },
                    { code: 'iOS', name: 'Science', desc: 'Classes 1-12 | ISRO Visit' },
                    { code: 'iOEL', name: 'English Language', desc: 'Classes 1-12 | Global Benchmark' },
                    { code: 'iAIO', name: 'Artificial Intelligence', desc: 'NEW 2026 | AI & Prompting' },
                    { code: 'STEM', name: 'STEM Innovation', desc: 'Science, Tech, Engg & Maths' },
                    { code: 'iCSO', name: 'Computer Science', desc: 'Classes 1-12 | Cyber & Coding' },
                    { code: 'iTHO', name: 'Talent Hunt', desc: 'Maths, Science & Reasoning' },
                    { code: 'iRAO', name: 'Reasoning & Aptitude', desc: 'Logical Reasoning Skills' },
                    { code: 'SKGKO', name: 'Smart Kid GK', desc: 'Current Affairs & GK' },
                    { code: 'iSSO', name: 'Social Studies', desc: 'History, Civics, Geography' },
                    { code: 'ABHO', name: 'Akhil Bhartiya Hindi', desc: 'Hindi Vyakaran & Sahitya' },
                    { code: 'iSCO', name: 'Commerce Olympiad', desc: 'Classes 11 & 12 | ₹50k 1st Prize' }
                  ].map((sub) => (
                    <div key={sub.code} className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px]">
                          {sub.code}
                        </span>
                        {sub.code === 'iAIO' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">
                            New Launch
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gray-900 text-xs">{sub.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{sub.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RealMetrics & Awards Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>RealMetrics™ Diagnostic Benchmarking</span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Comprehensive school assessment report providing class-wise cognitive strengths, national percentile rankings, and curriculum gap analysis.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-purple-700 font-bold">
                    <Award className="w-4 h-4" />
                    <span>18th Educators Achievement Awards</span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Best Principal Award (₹20,000 + Trophy), Best Teacher Award (₹10,000), and IMPACT Educationist of the Year. Nominations open alongside school registration!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LITTLE STAR OLYMPIAD */}
          {activeSubTab === 'LITTLE_STAR' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-amber-900 flex items-center space-x-1.5">
                    <span>⭐ Little Star Olympiad 2026-27</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                      Nursery, LKG & UKG
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-amber-800">
                    NEP 2020 ECCE Aligned
                  </span>
                </div>
                <p className="text-amber-800 text-xs">
                  Designed specifically for early childhood learners to nurture basic concepts, observation, and joyful discovery without exam stress.
                </p>
              </div>

              {/* Free Gift Kit Highlight */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                  <Gift className="w-4 h-4 text-emerald-700" />
                  <span>🎁 Free Assured Learning Kits for EVERY Child:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="bg-white p-2 rounded border border-emerald-200 text-center font-semibold text-emerald-800">
                    Sketch Pens Pack
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-200 text-center font-semibold text-emerald-800">
                    Wax Crayons Box
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-200 text-center font-semibold text-emerald-800">
                    Colour Pencils Set
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-200 text-center font-semibold text-emerald-800">
                    Creative Activity Kit
                  </div>
                </div>
              </div>

              {/* Subjects and Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-200 bg-white">
                  <div className="font-bold text-gray-900 mb-1">Pre-Primary Subjects:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Mathematics (Number sense & patterns)</li>
                    <li>English (Phonics & vocabulary)</li>
                    <li>EVS (Environmental awareness & nature)</li>
                    <li>Hindi (Language & alphabet recognition)</li>
                    <li>Drawing (*New - Fine motor skills & colors)</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 bg-white">
                  <div className="font-bold text-gray-900 mb-1">Fee & Honorarium:</div>
                  <div className="text-gray-700 space-y-1">
                    <div>Participation Fee: <strong className="font-mono">₹{config?.littleStarFee || 200}</strong> per child</div>
                    <div className="text-emerald-700 font-bold">School Honorarium: <strong>+₹25</strong> retained by school</div>
                    <div className="text-rose-700 font-bold mt-2">Registration Extended till: <strong>30th Sept 2026</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXAM DATES 2026-27 */}
          {activeSubTab === 'DATES' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-xs uppercase font-mono tracking-wider">
                  2026-27 Examination Slot Options (Schools Select Any 1 Date per Subject)
                </h4>
                <span className="text-[11px] font-mono text-gray-500">Dates in DD-MM-YYYY</span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <tr>
                      <th className="p-2.5">Olympiad</th>
                      <th className="p-2.5">First Date</th>
                      <th className="p-2.5">Second Date</th>
                      <th className="p-2.5">Third Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-mono">
                    {[
                      { name: 'iOM (Mathematics)', d1: '08-10-2026', d2: '18-11-2026', d3: '07-12-2026' },
                      { name: 'iOS (Science)', d1: '14-10-2026', d2: '19-11-2026', d3: '08-12-2026' },
                      { name: 'iOEL (English)', d1: '21-10-2026', d2: '26-11-2026', d3: '10-12-2026' },
                      { name: 'iCSO (Computer Science)', d1: '24-09-2026', d2: '22-10-2026', d3: '25-11-2026' },
                      { name: 'SKGKO (Smart Kid GK)', d1: '28-09-2026', d2: '27-10-2026', d3: '30-11-2026' },
                      { name: 'iSSO (Social Studies)', d1: '29-09-2026', d2: '28-10-2026', d3: '01-12-2026' },
                      { name: 'iRAO (Reasoning & Aptitude)', d1: '30-09-2026', d2: '02-11-2026', d3: '02-12-2026' },
                      { name: 'STEM Innovation Olympiad', d1: '01-10-2026', d2: '03-11-2026', d3: '03-12-2026' },
                      { name: 'ICSI Commerce (iSCO)', d1: '05-10-2026', d2: '04-11-2026', d3: '07-12-2026' },
                      { name: 'iTHO (Talent Hunt)', d1: '05-10-2026', d2: '04-11-2026', d3: '14-12-2026' },
                      { name: 'ABHO (Hindi Olympiad)', d1: '06-10-2026', d2: '05-11-2026', d3: '17-12-2026' },
                      { name: 'iAIO (Artificial Intelligence)', d1: '07-10-2026', d2: '23-11-2026', d3: '21-12-2026' }
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-gray-50">
                        <td className="p-2.5 font-sans font-medium text-gray-900">{row.name}</td>
                        <td className="p-2.5 text-indigo-700">{row.d1}</td>
                        <td className="p-2.5 text-blue-700">{row.d2}</td>
                        <td className="p-2.5 text-purple-700">{row.d3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FEE & RETENTION */}
          {activeSubTab === 'FEES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase font-mono tracking-wider">
                    Official Fee & School Retained Honorarium Breakdown
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Schools retain ₹{retention} per student directly towards teacher coordination and exam logistics
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] font-mono">
                  +₹{retention}/student Retained
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <tr>
                      <th className="p-2.5">Olympiad Category</th>
                      <th className="p-2.5">Base Fee (INR)</th>
                      <th className="p-2.5">School Retains (Honorarium)</th>
                      <th className="p-2.5">SilverZone Remittance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-2.5 font-medium">Standard Olympiads (Maths, Science, English, AI, Computer, GK, Hindi, SST)</td>
                      <td className="p-2.5 font-mono font-bold">₹{baseFee}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">+₹{retention} / student</td>
                      <td className="p-2.5 font-mono font-bold text-gray-800">₹{baseFee - retention} / student</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Little Star (Pre-Primary Nursery, LKG, UKG)</td>
                      <td className="p-2.5 font-mono font-bold">₹{config?.littleStarFee || 200}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">+₹{retention} / student</td>
                      <td className="p-2.5 font-mono font-bold text-gray-800">₹{(config?.littleStarFee || 200) - retention} (Includes 4 Art Kits)</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="p-2.5 font-bold text-emerald-900">Specially-Abled Students & Defence Martyrs' Children</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">₹0 (100% Free)</td>
                      <td className="p-2.5 text-emerald-800">100% Waived</td>
                      <td className="p-2.5 font-semibold text-emerald-700">₹0 (Full Scholarship)</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="p-2.5 font-bold text-blue-900">Level 2 & Level 3 Examinations (ISRO Trip)</td>
                      <td className="p-2.5 font-mono font-bold text-blue-700">₹0 (No Extra Fee)</td>
                      <td className="p-2.5 text-blue-800">Zero Additional Cost</td>
                      <td className="p-2.5 font-semibold text-blue-700">Fully Sponsored by Foundation</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Retention Simulation Box */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Live School Retention Calculator:</span>
                  </span>
                  <span className="font-mono font-extrabold text-indigo-700 text-xs">{simCount} Students</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={800}
                  step={10}
                  value={simCount}
                  onChange={(e) => setSimCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Collected</div>
                    <div className="font-mono font-bold text-gray-900 mt-0.5">₹{(simCount * baseFee).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                    <div className="text-[10px] text-emerald-800 uppercase font-bold">Retained by School</div>
                    <div className="font-mono font-black text-emerald-700 mt-0.5">₹{(simCount * retention).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Remit to Trust</div>
                    <div className="font-mono font-bold text-gray-900 mt-0.5">₹{(simCount * (baseFee - retention)).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Official PDFs */}
              <div className="p-3 rounded-lg border border-gray-200 bg-white space-y-1.5">
                <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Official Foundation Documents (PDF):</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="https://service.silverzone.org/Files/demo/main/School_Brochure_Thin_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold flex items-center gap-1 border border-rose-200"
                  >
                    <span>School_Brochure_Thin_2026.pdf</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://service.silverzone.org/Files/demo/littlestar/Brochure_LittleStar_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold flex items-center gap-1 border border-amber-200"
                  >
                    <span>Brochure_LittleStar_2026.pdf</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://service.silverzone.org/Files/demo/main/Poster_A2.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-semibold flex items-center gap-1 border border-indigo-200"
                  >
                    <span>Poster_A2.pdf</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WHATSAPP EXTENSION TEMPLATES (NO FEE AMOUNT PITCHED) */}
          {activeSubTab === 'TEMPLATES' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase font-mono tracking-wider">
                    Ready-to-Send Outreach Templates (Value & Benefit Focused)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Compliant with policy: No upfront fee pitch. Guides schools to the official brochure & TSM consultation.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Policy Compliant
                </span>
              </div>

              {[
                {
                  id: 'tmpl-sz-ext-main',
                  title: '📢 1. SilverZone 2026-27 Brochure & Extension Notice (Main)',
                  category: 'BROCHURE_EXTENSION',
                  text: `Respected Principal, Greetings from SilverZone Foundation (25th Silver Jubilee Year). We are pleased to share the official 2026-27 Olympiad Information Brochure for ${targetSchoolName}.\n\n📢 IMPORTANT UPDATE: Registration deadline for all 12 Olympiads has been officially EXTENDED TILL ${deadline.toUpperCase()}!\n\n🌟 Key Academic & Institutional Benefits:\n• 12 Subjects: Maths (iOM), Science (iOS), English (iOEL), STEM, Computer (iCSO), Talent Hunt (iTHO), Hindi (ABHO), Social Studies (iSSO), Reasoning (iRAO), GK (SKGKO), Commerce (iSCO) & AI (iAIO)\n• 1st Prize: ₹1,00,000 (Total awards worth ₹7.4 Crores!)\n• All Level 3 winners win an educational visit to ISRO & international study tours (NASA/UK)\n• No additional fee for Level 2 & Level 3\n• School retention allowance provided for faculty in-charge honorarium & exam administration\n• RealMetrics™ comprehensive student benchmarking report for school management\n\nView official 2026-27 prospectus & date schedule: ${brochureUrl}\n\nOur Territory Sales Manager for Nagpur (${tsmName}, ${tsmPhone}) can deliver registration forms directly to your campus this week. Would tomorrow or Thursday suit you?`
                },
                {
                  id: 'tmpl-sz-ext-littlestar',
                  title: '⭐ 2. Little Star Olympiad (Nursery to UKG) - Extended Deadline',
                  category: 'LITTLE_STAR',
                  text: `Dear Coordinator, SilverZone Foundation announces the Little Star Olympiad 2026-27 for Nursery, LKG & UKG students at ${targetSchoolName} (NEP 2020 ECCE aligned).\n\n⏰ DEADLINE EXTENSION: Registration cutoff officially EXTENDED TILL ${deadline.toUpperCase()}!\n\n🎨 Exciting Participant Highlights:\n• Foundational Subjects: Mathematics, English, EVS, Hindi & Drawing (*New)\n• 🎁 Assured Gift Kit: Free Sketch Pens, Wax Crayons, Colour Pencils & Activity Kit for EVERY participating child!\n• Participation certificate for all + Medals for class toppers (>50%) & Distinction gifts (>75%)\n• School retention allowance included for teacher in-charge honorarium\n\nView prospectus & schedules: ${brochureUrl}\n\nFeel free to connect directly with our Nagpur TSM (${tsmName}, ${tsmPhone}) to reserve student kits.`
                },
                {
                  id: 'tmpl-sz-ext-urgent',
                  title: '🚨 3. Urgent Principal Alert - Registration Extension Notice',
                  category: 'URGENT_DEADLINE',
                  text: `Respected Principal, following requests from school heads across Nagpur, SilverZone Foundation has officially extended the Olympiad registration cutoff till ${deadline.toUpperCase()} for ${targetSchoolName}.\n\nLeading CBSE institutions in the Nagpur cluster have already locked their Olympiad exam slots. By confirming before ${deadline}:\n1. Students compete for ₹7.4 Crore awards & ISRO space research educational visits\n2. 100% Free scholarship for Specially-abled students & Defence martyrs' children\n3. Outstanding Scholar Award (OSA): ₹5,000 scholarship + Trophy\n4. Retained school coordination honorarium included\n\nOfficial Digital Brochure: ${brochureUrl}\n\nCan we reserve participant kits for ${targetSchoolName}? Nagpur TSM Contact: ${tsmName} (${tsmPhone}).`
                },
                {
                  id: 'tmpl-sz-ext-educators',
                  title: '🏆 4. 18th Educators Achievement Awards & Udaan Initiatives',
                  category: 'EDUCATOR_RECOGNITION',
                  text: `Dear Principal, celebrating 25 years, SilverZone Foundation invites ${targetSchoolName} to nominate educators for the 18th Educators Achievement Awards (Best Principal: ₹20,000 + Trophy; Best Teacher: ₹10,000 + Trophy) and IMPACT Educationist Award.\n\n🕊️ Udaan Welfare Initiatives:\n• 100% FREE participation for teachers' children in Maths & Science Olympiads\n• Free AI Olympiad (iAIO) entry for Economically Weaker Section (EWS) students\n• SGCS Girl Child Scholarship: ₹5,000 for 100 meritorious female students\n\nRegistration deadline extended till ${deadline}. View details: ${brochureUrl}\nContact: ${tsmName} (${tsmPhone}).`
                },
                {
                  id: 'tmpl-sz-ext-realmetrics',
                  title: '🤖 5. RealMetrics™ & AI Olympiad (iAIO) Launch',
                  category: 'AI_OLYMPIAD',
                  text: `Respected Principal, introduce cutting-edge diagnostic assessments to ${targetSchoolName} students with SilverZone's new International Artificial Intelligence Olympiad (iAIO) and RealMetrics™ Olympiad Benchmarking Report for 2026-27.\n\n📅 Multiple exam dates available across October, November & December 2026.\n📢 School registration has been extended till ${deadline}.\n\nRealMetrics™ provides your school management with class-wise cognitive strengths, national percentile rankings, and curriculum gap analysis. View the 2026-27 brochure here: ${brochureUrl}\nNagpur TSM: ${tsmName} (${tsmPhone}).`
                }
              ].map((tpl) => (
                <div key={tpl.id} className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">{tpl.title}</span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleCopyText(tpl.text, tpl.id)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedTemplateId === tpl.id ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span className="text-green-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-gray-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {onLaunchWhatsApp && (
                        <button
                          onClick={() => onLaunchWhatsApp(tpl.id)}
                          className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Use in WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-gray-50 text-[11px] text-gray-700 font-sans whitespace-pre-wrap leading-relaxed border border-gray-100">
                    {tpl.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 font-mono">
            SilverZone Foundation • New Delhi • Reg. No. 1533 • Helpline: 011-69114100
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded bg-[#990033] hover:bg-[#80002b] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <span>Open Public Prospectus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
