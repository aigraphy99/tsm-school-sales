import React from 'react';
import {
  Download,
  Server,
  Terminal,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';

export const DeploymentView: React.FC = () => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const localCommands = `# 1. Extract ZIP on your PC / Laptop
unzip school_sales_os_deploy.zip -d school_sales_os
cd school_sales_os

# 2. Install dependencies & Launch
npm install
npm run dev

# 3. Open in your browser:
# http://localhost:3000`;

  const hosterCommands = `# 1. Build the production bundle
npm run build

# 2. For standard shared hoster (cPanel / Apache / Nginx):
# Upload the contents of the generated 'dist/' folder directly into your 'public_html' directory.

# 3. For Node.js VPS / Hoster:
# Upload package.json, dist/server.cjs, and data/ folder.
# Run with PM2 or systemd:
pm2 start dist/server.cjs --name "school-sales-os"
pm2 save`;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-indigo-700" />
              <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">
                Production Deployment Engine
              </span>
              <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 text-[10px] font-bold border border-green-200">
                Self-Contained • Standalone Bundle
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Hoster Server, Localhost & VPS Deployment Center
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Download the entire fully-functional application as a ZIP package ready for immediate team deployment or upload to your hosting server.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="/api/schools/export/csv"
              className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300 flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-700" />
              <span>Export 330 Schools CSV</span>
            </a>

            <a
              href="/api/export/zip"
              className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete ZIP Package</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Step Quickstart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Test Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-700" />
              <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">Option A: Run Locally on Laptop</h3>
            </div>
            <button
              onClick={() => copyToClipboard(localCommands, 'local')}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSection === 'local' ? 'Copied!' : 'Copy Commands'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Zero setup required. Works out of the box with Node.js 18+.
          </p>

          <pre className="bg-gray-900 border border-gray-800 rounded p-3 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed">
            {localCommands}
          </pre>
        </div>

        {/* Hoster Server Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-indigo-700" />
              <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">Option B: Deploy to Hoster / public_html</h3>
            </div>
            <button
              onClick={() => copyToClipboard(hosterCommands, 'hoster')}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSection === 'hoster' ? 'Copied!' : 'Copy Guide'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-500">
            For cPanel, Shared Hosting, CyberPanel, Hostinger, or Ubuntu VPS.
          </p>

          <pre className="bg-gray-900 border border-gray-800 rounded p-3 text-xs text-blue-300 font-mono overflow-x-auto leading-relaxed">
            {hosterCommands}
          </pre>
        </div>
      </div>

      {/* Deployment Verification Checklist */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
          Production Architecture & Verification Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-green-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Embedded Data Store</span>
            </div>
            <p className="text-gray-500">
              Pre-loaded with 330 Nagpur schools, verified WhatsApp templates, and evidence tracking in JSON database.
            </p>
          </div>

          <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-green-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Standalone Node.js Server</span>
            </div>
            <p className="text-gray-500">
              Bundled with esbuild into a single file (<code className="text-gray-800 font-mono">dist/server.cjs</code>) with zero missing relative path issues.
            </p>
          </div>

          <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-green-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Server-Side Gemini API</span>
            </div>
            <p className="text-gray-500">
              AI pre-call briefing and summarization logic runs securely on server without exposing API keys to clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
