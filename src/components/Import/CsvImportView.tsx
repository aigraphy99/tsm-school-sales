import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Sparkles,
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { previewCsv, commitImport } from '../../api.js';

interface CsvImportViewProps {
  onImportComplete: () => void;
}

export const CsvImportView: React.FC<CsvImportViewProps> = ({ onImportComplete }) => {
  const [rawCsvText, setRawCsvText] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [commitSuccess, setCommitSuccess] = useState<number | null>(null);

  const sampleCsvBatch = `School Name,School Code,Area,City,Board,Principal Name,Mobile,Email,Student Strength
Bhavan's Bhagwandas Purohit Vidya Mandir,BVM-DH-01,Civil Lines,Nagpur,CBSE,Smt. Anju Bhutani,9822114401,principal.cl@bvm.edu.in,2450
Centre Point School,CPS-WN-02,Wardhaman Nagar,Nagpur,CBSE,Mrs. Sumathi Venugopalan,9822114402,info.wn@centrepoint.edu.in,2100
Delhi Public School Mihan,DPS-MH-03,Mihan,Nagpur,CBSE,Ms. Savita Jaiswal,9822114403,principal@dpsnagpur.edu.in,1850
Somani International School,SIS-SD-04,Sadar,Nagpur,ICSE,Dr. Rajesh Aggarwal,9822114404,office@somanischool.org,1400
Narayana Vidyalayam,NV-CT-05,Chhatrapati Square,Nagpur,CBSE,Mrs. Mala Chembath,9822114405,principal@narayanavidyalayam.in,1950
Modern School Koradi,MS-KD-06,Koradi Road,Nagpur,CBSE,Mrs. Neeru Kapai,9822114406,koradi@modernschool.edu.in,1650
School of Scholars Wanadongri,SOS-WD-07,Wanadongri,Nagpur,CBSE,Mrs. Kavita Nagarajan,9822114407,sos.wanadongri@mgsedu.org,2200
St. Vincent Pallotti School,SVP-BS-08,Besan,Nagpur,CBSE,Rev. Fr. Joseph,9822114408,pallotti.school@gmail.com,1780
St. John's High School,SJH-MH-09,Mohan Nagar,Nagpur,State Board,Br. Philip,9822114409,stjohns.nagpur@gmail.com,1350
Sandipani School,SNP-HZ-10,Hazari Pahad,Nagpur,CBSE,Dr. Shanthi Menon,9822114410,sandipani.hazari@gmail.com,1550`;

  const handleLoadSample = () => {
    setRawCsvText(sampleCsvBatch);
    setCommitSuccess(null);
  };

  const handlePreview = async () => {
    if (!rawCsvText.trim()) return;
    setIsPreviewing(true);
    setCommitSuccess(null);
    try {
      const res = await previewCsv(rawCsvText);
      setPreviewData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleCommit = async () => {
    if (!previewData || !previewData.rows) return;
    setIsCommitting(true);
    try {
      const res = await commitImport(previewData.rows, 'terr-nagpur');
      setCommitSuccess(res.addedCount);
      onImportComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawCsvText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawCsvText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-green-700" />
              <span className="text-[10px] font-mono font-bold text-green-800 uppercase tracking-wider">
                CSV & Excel Ingestion Pipeline
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              High-Volume School Batch Import & Reconciliation Engine
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Supports 100 to 1,000+ school records with automated header mapping, phone normalization (+91), deduplication, and conflict detection.
            </p>
          </div>

          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center space-x-1.5 self-start cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
            <span>Load Sample Nagpur 10-School Batch</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {commitSuccess !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 flex items-center justify-between animate-in fade-in shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-green-900">
                Reconciliation & Import Completed Successfully!
              </div>
              <div className="text-xs text-green-700">
                {commitSuccess} new schools have been integrated into the Master Database and assigned to Nagpur territory.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setPreviewData(null);
              setCommitSuccess(null);
              setRawCsvText('');
            }}
            className="text-xs font-bold text-green-800 hover:text-green-950 px-3 py-1 bg-green-100 hover:bg-green-200 border border-green-300 rounded cursor-pointer"
          >
            Import Another Batch
          </button>
        </div>
      )}

      {/* Upload Box / Input Area */}
      {!previewData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 hover:border-indigo-600 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-white transition-all cursor-pointer group"
          >
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mb-2 transition-colors" />
            <h3 className="text-xs font-bold text-gray-900">Drag & drop your CSV or Excel file</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Accepts .csv files. Headers will be automatically mapped to School Name, Area, Board, Principal, Mobile, etc.
            </p>

            <label className="mt-3 px-3.5 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300 cursor-pointer shadow-xs">
              <span>Browse File on Machine</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct CSV Text Box */}
          <div className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-2.5 flex flex-col shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 uppercase font-mono">
                Or Paste Raw CSV Data Below
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-indigo-700 hover:underline font-medium cursor-pointer"
              >
                Paste Nagpur Sample
              </button>
            </div>

            <textarea
              value={rawCsvText}
              onChange={(e) => setRawCsvText(e.target.value)}
              placeholder="School Name,Area,City,Board,Principal Name,Mobile..."
              rows={8}
              className="w-full flex-1 bg-gray-50 border border-gray-300 rounded p-2.5 text-xs text-gray-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none"
            />

            <button
              onClick={handlePreview}
              disabled={isPreviewing || !rawCsvText.trim()}
              className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPreviewing ? 'animate-spin' : ''}`} />
              <span>Analyze & Preview Reconciliation</span>
            </button>
          </div>
        </div>
      )}

      {/* Reconciliation Preview Screen */}
      {previewData && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-700 font-bold">
                Reconciliation Analysis
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">
                Batch Quality & Deduplication Report
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewData(null)}
                className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium cursor-pointer shadow-xs"
              >
                Re-upload
              </button>
              <button
                onClick={handleCommit}
                disabled={isCommitting}
                className="px-3.5 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Commit Batch to Database</span>
              </button>
            </div>
          </div>

          {/* Reconciliation Stats Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
              <div className="text-[10px] font-bold uppercase text-gray-500">Total Rows in Batch</div>
              <div className="text-xl font-black text-gray-900 font-mono mt-0.5">
                {previewData.summary?.totalRows || 0}
              </div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
              <div className="text-[10px] font-bold uppercase text-green-700">New Valid Records</div>
              <div className="text-xl font-black text-green-700 font-mono mt-0.5">
                {previewData.summary?.newRows || 0}
              </div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
              <div className="text-[10px] font-bold uppercase text-orange-600">Duplicate Ignored</div>
              <div className="text-xl font-black text-orange-700 font-mono mt-0.5">
                {previewData.summary?.duplicates || 0}
              </div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
              <div className="text-[10px] font-bold uppercase text-blue-600">Mapped Fields</div>
              <div className="text-xl font-black text-blue-700 font-mono mt-0.5">
                {previewData.mappedColumns?.length || 8}
              </div>
            </div>
          </div>

          {/* Rows Preview Table */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 font-mono text-gray-600 border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3 font-semibold">School Name</th>
                  <th className="py-2 px-3 font-semibold">Area & City</th>
                  <th className="py-2 px-3 font-semibold">Board</th>
                  <th className="py-2 px-3 font-semibold">Principal / Mobile</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {previewData.rows?.slice(0, 10).map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-indigo-50/40">
                    <td className="py-2 px-3 font-semibold text-gray-900">{r.name}</td>
                    <td className="py-2 px-3 text-gray-500">{r.area}, {r.city}</td>
                    <td className="py-2 px-3 font-mono text-gray-700">{r.board}</td>
                    <td className="py-2 px-3">
                      <div className="text-gray-900">{r.principalName || 'N/A'}</div>
                      <div className="text-[10px] font-mono text-gray-500">{r.mobile || 'N/A'}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 font-mono text-[10px] font-bold">
                        READY TO COMMIT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
