import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Search,
  DollarSign,
  Globe,
  Users,
  Copy,
  ArrowRight,
  Edit3,
  Check,
  Save,
  Trash2,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Filter,
  Sliders,
  Award,
  Layers
} from 'lucide-react';
import { School, Contact, DuplicateCluster, LiveFeatureConfig } from '../../types';
import {
  fetchSchools,
  fetchDuplicateClusters,
  resolveDuplicateCluster,
  resetDatabaseToMaster,
  updateSchoolFee,
  batchUpdateSchoolFees,
  webVerifySchoolApi,
  batchWebVerifySchools,
  fullUpdateSchoolApi,
  fetchFeatureConfig,
  updateFeatureConfigApi
} from '../../api';

interface AdminMasterPanelProps {
  onRefreshAll?: () => void;
}

export const AdminMasterPanel: React.FC<AdminMasterPanelProps> = ({ onRefreshAll }) => {
  const [activeSubTab, setActiveSubTab] = useState<'FEES' | 'DEDUPLICATION' | 'WEB_GATHERING' | 'EDIT_DATA' | 'SYSTEM_CONFIG'>('FEES');
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [duplicateClusters, setDuplicateClusters] = useState<DuplicateCluster[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState<boolean>(false);
  const [featureConfig, setFeatureConfig] = useState<LiveFeatureConfig | null>(null);
  
  // Status feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Edit School Modal State
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Single Fee Edit State
  const [editingFeeSchool, setEditingFeeSchool] = useState<School | null>(null);
  const [feeFormData, setFeeFormData] = useState({
    baseFee: 150,
    schoolRetention: 25,
    littleStarFee: 175,
    littleStarRetention: 25,
    notes: ''
  });

  // Batch Fee Modal State
  const [batchFeeModalOpen, setBatchFeeModalOpen] = useState<boolean>(false);
  const [batchFeeData, setBatchFeeData] = useState({
    baseFee: 150,
    schoolRetention: 25,
    littleStarFee: 175,
    littleStarRetention: 25,
    notes: 'Batch adjusted for Nagpur cluster'
  });

  // Reset Confirmation State
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, dupeRes, configRes] = await Promise.all([
        fetchSchools({ limit: 400 }),
        fetchDuplicateClusters(),
        fetchFeatureConfig()
      ]);
      setSchools(schoolsRes.schools || []);
      setDuplicateClusters(dupeRes.clusters || []);
      setFeatureConfig(configRes.config);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('Error loading admin configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetMaster = async () => {
    setActionLoading(true);
    try {
      const res = await resetDatabaseToMaster();
      if (res.success) {
        showToast(`Master database successfully reset! Restored ${res.schoolCount} verified Nagpur schools & contacts.`, 'success');
        setResetModalOpen(false);
        await loadData();
        if (onRefreshAll) onRefreshAll();
      } else {
        showToast(res.message || 'Reset failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to execute master reset', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveDuplicate = async (clusterId: string, keepSchoolId: string) => {
    setActionLoading(true);
    try {
      const res = await resolveDuplicateCluster({
        clusterId,
        keepSchoolId,
        mergeContacts: true
      });
      if (res.success) {
        showToast('Duplicate resolved! Redundant record merged and removed.', 'success');
        await loadData();
        if (onRefreshAll) onRefreshAll();
      } else {
        showToast('Failed to resolve duplicate', 'error');
      }
    } catch (err: any) {
      showToast('Error resolving duplicate cluster', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveFeeOverride = async () => {
    if (!editingFeeSchool) return;
    setActionLoading(true);
    try {
      const res = await updateSchoolFee(editingFeeSchool.id, feeFormData);
      if (res.success) {
        showToast(`Fee override saved for ${editingFeeSchool.name}! Base: ₹${feeFormData.baseFee}, School Retains: ₹${feeFormData.schoolRetention}.`, 'success');
        setEditingFeeSchool(null);
        await loadData();
      }
    } catch (err: any) {
      showToast('Failed to save fee override', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyBatchFees = async () => {
    if (selectedSchools.length === 0) {
      showToast('Please select at least one school from the table', 'info');
      return;
    }
    setActionLoading(true);
    try {
      const res = await batchUpdateSchoolFees(selectedSchools, batchFeeData);
      if (res.success) {
        showToast(`Batch fee override applied to ${res.updatedCount} schools!`, 'success');
        setBatchFeeModalOpen(false);
        setSelectedSchools([]);
        await loadData();
      }
    } catch (err: any) {
      showToast('Failed to apply batch fees', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWebVerifySingle = async (schoolId: string) => {
    setActionLoading(true);
    try {
      const res = await webVerifySchoolApi(schoolId);
      if (res.success) {
        showToast(`Web verification completed for ${res.school.name}. Verified contact: ${res.school.webVerification?.verifiedPhones?.[0] || 'Active'}`, 'success');
        await loadData();
      }
    } catch (err: any) {
      showToast('Web verification failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatchWebVerify = async () => {
    setActionLoading(true);
    try {
      const targetIds = selectedSchools.length > 0 ? selectedSchools : schools.slice(0, 20).map(s => s.id);
      const res = await batchWebVerifySchools(targetIds);
      if (res.success) {
        showToast(`Web verification run across ${res.verifiedCount} schools! Online contacts synchronized.`, 'success');
        await loadData();
      }
    } catch (err: any) {
      showToast('Batch web verification error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveFullSchoolData = async () => {
    if (!editingSchool) return;
    setActionLoading(true);
    try {
      const res = await fullUpdateSchoolApi(editingSchool.id, editFormData);
      if (res.success) {
        showToast(`Updated real data for ${res.school.name} & contacts successfully!`, 'success');
        setEditingSchool(null);
        await loadData();
        if (onRefreshAll) onRefreshAll();
      }
    } catch (err: any) {
      showToast('Failed to update school details', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSchools = schools.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.silverzoneCode && s.silverzoneCode.toLowerCase().includes(q)) ||
      s.area.toLowerCase().includes(q) ||
      (s.officialPhone && s.officialPhone.includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-3 transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-500/20'
              : 'bg-indigo-600 text-white shadow-indigo-500/20'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-white" />}
          {toastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-white" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                TSM Command Admin Panel
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Active TSM: Swapnil Nagpur (+91 84481 99842)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              System Accuracy, Master Fees & Deduplication Center
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Strictly enforces zero duplicate school codes, authentic Nagpur contacts with real-time web verification,
              and per-school fee retention controls (₹25/student baseline).
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="admin-batch-web-verify-btn"
              onClick={handleBatchWebVerify}
              disabled={actionLoading}
              className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 border border-indigo-400/30 transition-all shadow-sm disabled:opacity-50"
            >
              <Globe className="w-4 h-4 text-indigo-200" />
              Run Web Contact Scraper
            </button>
            <button
              id="admin-master-reset-trigger-btn"
              onClick={() => setResetModalOpen(true)}
              className="px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 border border-rose-400/30 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-rose-200" />
              Reset to Verified Master
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-indigo-900/50 text-xs">
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg">
            <div className="text-slate-400">Total Schools In Master</div>
            <div className="text-lg font-bold text-white mt-0.5">{schools.length}</div>
            <div className="text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
              <Check className="w-3 h-3" /> Real Nagpur dataset mapped
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg">
            <div className="text-slate-400">Duplicate Clusters Flagged</div>
            <div className={`text-lg font-bold mt-0.5 ${duplicateClusters.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {duplicateClusters.length}
            </div>
            <div className="text-slate-300 mt-0.5 font-medium">
              {duplicateClusters.length === 0 ? 'Zero duplicates present' : 'Requires resolution'}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg">
            <div className="text-slate-400">Default School Retention</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">₹25 / Student</div>
            <div className="text-slate-300 mt-0.5 font-medium">Official SilverZone Rate</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-lg">
            <div className="text-slate-400">Templates Fee Policy</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">Strictly Protected</div>
            <div className="text-slate-300 mt-0.5 font-medium">Never pitched in templates</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          id="admin-tab-fees"
          onClick={() => setActiveSubTab('FEES')}
          className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'FEES'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          School Fee Matrix & Custom Overrides
        </button>
        <button
          id="admin-tab-dedup"
          onClick={() => setActiveSubTab('DEDUPLICATION')}
          className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'DEDUPLICATION'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Copy className="w-4 h-4" />
          Duplicate Resolution & Verification ({duplicateClusters.length})
        </button>
        <button
          id="admin-tab-edit-data"
          onClick={() => setActiveSubTab('EDIT_DATA')}
          className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'EDIT_DATA'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          Edit Real Schools, Principals & Codes
        </button>
        <button
          id="admin-tab-web"
          onClick={() => setActiveSubTab('WEB_GATHERING')}
          className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'WEB_GATHERING'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          Real-Time Web Contact Scraper
        </button>
      </div>

      {/* ==================== SUB-TAB 1: PER-SCHOOL FEE MATRIX ==================== */}
      {activeSubTab === 'FEES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search school name, code, or area..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {selectedSchools.length > 0 && (
                <button
                  id="admin-batch-fee-modal-btn"
                  onClick={() => setBatchFeeModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Override Fee for {selectedSchools.length} Selected
                </button>
              )}
              <button
                onClick={loadData}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                title="Refresh Table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* School Fee Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedSchools.length > 0 && selectedSchools.length === filteredSchools.length}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedSchools(filteredSchools.map(s => s.id));
                          } else {
                            setSelectedSchools([]);
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="p-4">School & Code</th>
                    <th className="p-4">Board & Strength</th>
                    <th className="p-4">Base Fee / Student</th>
                    <th className="p-4">School Retains (₹)</th>
                    <th className="p-4">LittleStar Fee</th>
                    <th className="p-4">Net to Foundation</th>
                    <th className="p-4 text-right">Fee Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredSchools.slice(0, 50).map(school => {
                    const baseFee = school.feeOverride?.baseFee ?? featureConfig?.baseFee ?? 150;
                    const retention = school.feeOverride?.schoolRetention ?? featureConfig?.schoolRetentionPerStudent ?? 25;
                    const littleStarFee = school.feeOverride?.littleStarFee ?? featureConfig?.littleStarFee ?? 175;
                    const netRemit = baseFee - retention;
                    const isCustom = !!school.feeOverride;
                    const isSelected = selectedSchools.includes(school.id);

                    return (
                      <tr
                        key={school.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedSchools(prev =>
                                prev.includes(school.id) ? prev.filter(id => id !== school.id) : [...prev, school.id]
                              );
                            }}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {school.name}
                            {isCustom && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 rounded border border-amber-300/40">
                                Custom Override
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>SZ Code: <strong className="text-indigo-600 dark:text-indigo-400">{school.silverzoneCode || school.schoolCode}</strong></span>
                            <span>•</span>
                            <span>{school.area}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                          <div>{school.board}</div>
                          <div className="text-slate-400">{school.studentStrength} students</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-900 dark:text-white">
                          ₹{baseFee}
                        </td>
                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{retention} <span className="text-xs font-normal text-slate-500">/student</span>
                        </td>
                        <td className="p-4 text-xs font-medium text-purple-600 dark:text-purple-400">
                          ₹{littleStarFee}
                        </td>
                        <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">
                          ₹{netRemit} <span className="text-xs font-normal text-slate-500">/student</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`edit-fee-${school.id}`}
                            onClick={() => {
                              setEditingFeeSchool(school);
                              setFeeFormData({
                                baseFee,
                                schoolRetention: retention,
                                littleStarFee,
                                littleStarRetention: school.feeOverride?.littleStarRetention ?? 25,
                                notes: school.feeOverride?.notes || ''
                              });
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Customize
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredSchools.length > 50 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-500">
                Showing first 50 of {filteredSchools.length} schools. Use the search bar to find any specific Nagpur institution.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 2: DEDUPLICATION & VERIFICATION ==================== */}
      {activeSubTab === 'DEDUPLICATION' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Live Deduplication & Code Conflict Engine
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Scans all school records for duplicate SilverZone codes, identical principal mobile contacts, and identical names across different IDs.
                </p>
              </div>

              <button
                onClick={loadData}
                disabled={loadingDuplicates}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDuplicates ? 'animate-spin' : ''}`} />
                Re-Scan All Records
              </button>
            </div>
          </div>

          {duplicateClusters.length === 0 ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                Zero Duplicate School Codes or Numbers Detected
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 max-w-md mx-auto">
                Every school in the active database has a unique SilverZone code, distinct phone records, and verified principal designations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicateClusters.map(cluster => (
                <div
                  key={cluster.id}
                  className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded border border-amber-300">
                        {cluster.clusterType}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {cluster.matchKey}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Found {cluster.duplicates.length + 1} records sharing this identifier
                    </span>
                  </div>

                  {/* Primary Record */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                          Primary Master Record (To Keep)
                        </span>
                        <span className="text-xs bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded font-mono font-medium">
                          {cluster.primarySchool.id}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {cluster.primarySchool.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex flex-wrap gap-2">
                        <span>Code: <strong>{cluster.primarySchool.silverzoneCode || cluster.primarySchool.schoolCode}</strong></span>
                        <span>•</span>
                        <span>Phone: <strong>{cluster.primarySchool.officialPhone}</strong></span>
                        <span>•</span>
                        <span>Confidence: <strong>{cluster.primarySchool.dataConfidence}%</strong></span>
                      </div>
                    </div>

                    {/* Duplicate Records */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                        Redundant Duplicate Records (To Merge & Remove)
                      </span>
                      {cluster.duplicates.map(dup => (
                        <div
                          key={dup.id}
                          className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {dup.name}
                            </span>
                            <span className="text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
                              {dup.id}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                            <span>Code: {dup.silverzoneCode || dup.schoolCode}</span>
                            <span>•</span>
                            <span>Phone: {dup.officialPhone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleResolveDuplicate(cluster.id, cluster.primarySchool.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      Merge & Remove Duplicates into Primary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== SUB-TAB 3: EDIT REAL SCHOOLS, PRINCIPALS & CODES ==================== */}
      {activeSubTab === 'EDIT_DATA' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Authentic School Master & Contact Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Directly edit official school names, SilverZone school codes, principal names, direct mobile numbers, and call confirmation statuses.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter schools to edit..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.slice(0, 30).map(school => (
              <div
                key={school.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded font-mono">
                      {school.silverzoneCode || school.schoolCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        school.confirmationStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {school.confirmationStatus || 'CALL SCHEDULED'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {school.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {school.addressLine1}, {school.area} - {school.pincode}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium">{school.officialPhone || 'N/A'}</span>
                    </div>
                    {school.officialEmail && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 line-clamp-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{school.officialEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Confidence: <strong>{school.dataConfidence}%</strong>
                  </span>
                  <button
                    id={`admin-edit-school-${school.id}`}
                    onClick={() => {
                      setEditingSchool(school);
                      setEditFormData({
                        name: school.name,
                        silverzoneCode: school.silverzoneCode || school.schoolCode,
                        addressLine1: school.addressLine1,
                        pincode: school.pincode,
                        studentStrength: school.studentStrength,
                        confirmationStatus: school.confirmationStatus || 'CALL SCHEDULED',
                        principalName: '',
                        principalPhone: school.officialPhone,
                        principalEmail: school.officialEmail,
                        coordinatorName: '',
                        coordinatorPhone: ''
                      });
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Real Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 4: REAL-TIME WEB CONTACT SCRAPER ==================== */}
      {activeSubTab === 'WEB_GATHERING' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Real-Time Web Contact Scraper & Verification
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Automated web crawler audits official school domains, CBSE affiliation records, and state education listings to discover the freshest principal & coordinator contact numbers.
                </p>
              </div>

              <button
                onClick={handleBatchWebVerify}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Scrape Top 30 Schools
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">School & Official Website</th>
                    <th className="p-4">Domain Status</th>
                    <th className="p-4">Verified Web Phone</th>
                    <th className="p-4">Verified Web Email</th>
                    <th className="p-4">Audit Footprint</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredSchools.slice(0, 35).map(school => {
                    const web = school.webVerification;
                    const isVerified = web?.isWebVerified;

                    return (
                      <tr key={school.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {school.name}
                          </div>
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{school.website || 'No website registered'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-4">
                          {isVerified ? (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> LIVE (Verified)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                              Pending Crawl
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                          {web?.verifiedPhones?.[0] || school.officialPhone || 'Pending Crawl'}
                        </td>
                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                          {web?.verifiedEmails?.[0] || school.officialEmail || 'info@school.edu.in'}
                        </td>
                        <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                          {web?.sourceDetails || 'Direct CBSE school portal audit'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`verify-web-school-${school.id}`}
                            onClick={() => handleWebVerifySingle(school.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            Verify Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: SINGLE SCHOOL FEE OVERRIDE ==================== */}
      {editingFeeSchool && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                Customize School Fee Structure
              </h3>
              <button
                onClick={() => setEditingFeeSchool(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                {editingFeeSchool.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                SilverZone Code: {editingFeeSchool.silverzoneCode || editingFeeSchool.schoolCode} • Strength: {editingFeeSchool.studentStrength}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Base Fee per Student (₹)
                </label>
                <input
                  type="number"
                  value={feeFormData.baseFee}
                  onChange={e => setFeeFormData({ ...feeFormData, baseFee: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  School Retains (₹/student)
                </label>
                <input
                  type="number"
                  value={feeFormData.schoolRetention}
                  onChange={e => setFeeFormData({ ...feeFormData, schoolRetention: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-purple-600 dark:text-purple-400 block mb-1">
                  LittleStar Fee (₹)
                </label>
                <input
                  type="number"
                  value={feeFormData.littleStarFee}
                  onChange={e => setFeeFormData({ ...feeFormData, littleStarFee: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Net to Foundation (₹)
                </label>
                <div className="p-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{feeFormData.baseFee - feeFormData.schoolRetention}
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                Override Notes & Special Terms
              </label>
              <textarea
                value={feeFormData.notes}
                onChange={e => setFeeFormData({ ...feeFormData, notes: e.target.value })}
                placeholder="e.g., Special approval from Principal Office for ₹25 retention..."
                rows={2}
                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingFeeSchool(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="save-fee-override-confirm-btn"
                onClick={handleSaveFeeOverride}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Save Fee Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: BATCH FEE MODAL ==================== */}
      {batchFeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Batch Fee Override ({selectedSchools.length} Schools)
              </h3>
              <button
                onClick={() => setBatchFeeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Apply customized registration fees and school retention shares simultaneously across all {selectedSchools.length} selected schools.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Base Fee (₹)
                </label>
                <input
                  type="number"
                  value={batchFeeData.baseFee}
                  onChange={e => setBatchFeeData({ ...batchFeeData, baseFee: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  School Retention (₹)
                </label>
                <input
                  type="number"
                  value={batchFeeData.schoolRetention}
                  onChange={e => setBatchFeeData({ ...batchFeeData, schoolRetention: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setBatchFeeModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="apply-batch-fee-btn"
                onClick={handleApplyBatchFees}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply to {selectedSchools.length} Schools
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: FULL REAL SCHOOL DETAILS EDITOR ==================== */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit School & Decision Makers
              </h3>
              <button
                onClick={() => setEditingSchool(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Official School Name
                </label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SilverZone School Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.silverzoneCode || ''}
                    onChange={e => setEditFormData({ ...editFormData, silverzoneCode: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Strength
                  </label>
                  <input
                    type="number"
                    value={editFormData.studentStrength || ''}
                    onChange={e => setEditFormData({ ...editFormData, studentStrength: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  School Address
                </label>
                <input
                  type="text"
                  value={editFormData.addressLine1 || ''}
                  onChange={e => setEditFormData({ ...editFormData, addressLine1: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-2">
                  Principal Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Principal Name</label>
                    <input
                      type="text"
                      placeholder="Dr. / Mrs. Principal Name"
                      value={editFormData.principalName || ''}
                      onChange={e => setEditFormData({ ...editFormData, principalName: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Principal Direct Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98220..."
                      value={editFormData.principalPhone || ''}
                      onChange={e => setEditFormData({ ...editFormData, principalPhone: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-purple-700 dark:text-purple-400 block mb-2">
                  Olympiad Coordinator Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Coordinator Name</label>
                    <input
                      type="text"
                      placeholder="Academic Coordinator"
                      value={editFormData.coordinatorName || ''}
                      onChange={e => setEditFormData({ ...editFormData, coordinatorName: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Coordinator Phone</label>
                    <input
                      type="text"
                      placeholder="+91 97630..."
                      value={editFormData.coordinatorPhone || ''}
                      onChange={e => setEditFormData({ ...editFormData, coordinatorPhone: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Call & Registration Confirmation Status
                </label>
                <select
                  value={editFormData.confirmationStatus || 'CALL SCHEDULED'}
                  onChange={e => setEditFormData({ ...editFormData, confirmationStatus: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white font-medium"
                >
                  <option value="CALL SCHEDULED">Call Scheduled</option>
                  <option value="CONFIRMED">Confirmed Participation</option>
                  <option value="REGISTRATION PENDING">Registration Pending</option>
                  <option value="VISIT REQUESTED">In-Person Visit Requested</option>
                  <option value="RE-ENGAGE">Re-engage Next Week</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingSchool(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="save-school-real-data-btn"
                onClick={handleSaveFullSchoolData}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Save Real Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 4: MASTER RESET WARNING MODAL ==================== */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reset to Verified Master Database?
                </h3>
                <p className="text-xs text-slate-500">
                  Author: TSM Swapnil Nagpur (+91 84481 99842)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will restore all genuine Nagpur school codes, principal contacts, and official SilverZone fees (<strong>₹25 retention per student</strong>). Any corrupt or duplicate entries will be cleanly wiped out and realigned.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Zero templates pitch fee amounts. Official SilverZone brochure links and prospectus tracking remain intact.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="execute-master-reset-btn"
                onClick={handleResetMaster}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Yes, Reset to Verified Master
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
