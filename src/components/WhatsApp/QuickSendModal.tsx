import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { MessageTemplate } from '../../types.js';
import { fetchTemplates, sendWhatsAppMessage } from '../../api.js';

interface QuickSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSchool: {
    id: string;
    name: string;
    phone?: string;
    contactName?: string;
    designation?: string;
  } | null;
  onSentSuccess?: () => void;
}

export const QuickSendModal: React.FC<QuickSendModalProps> = ({
  isOpen,
  onClose,
  targetSchool,
  onSentSuccess
}) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && targetSchool) {
      setMobileNumber(targetSchool.phone || '');
      setRecipientName(targetSchool.contactName || 'Principal');

      fetchTemplates().then((tpls) => {
        setTemplates(tpls);
        if (tpls.length > 0) {
          setSelectedTemplateId(tpls[0].id);
          const tplText = ((tpls[0] as any).content || (tpls[0] as any).body || '')
            .replace(/{{school_name}}/g, targetSchool.name)
            .replace(/{{principal_name}}/g, targetSchool.contactName || 'Principal')
            .replace(/{{coordinator_name}}/g, targetSchool.contactName || 'Coordinator')
            .replace(/{{city}}/g, 'Nagpur')
            .replace(/{{area}}/g, 'Nagpur')
            .replace(/{{tsm_name}}/g, 'Swapnil')
            .replace(/{{brochure_url}}/g, `${window.location.origin}/share/brochure/${targetSchool.id}`);
          setCustomText(tplText);
        }
      });
    } else {
      setGeneratedUrl('');
    }
  }, [isOpen, targetSchool]);

  if (!isOpen || !targetSchool) return null;

  const handleTemplateSelect = (tId: string) => {
    setSelectedTemplateId(tId);
    const tpl = templates.find((t) => t.id === tId);
    if (tpl) {
      const tplText = ((tpl as any).content || (tpl as any).body || '')
        .replace(/{{school_name}}/g, targetSchool.name)
        .replace(/{{principal_name}}/g, recipientName || 'Principal')
        .replace(/{{coordinator_name}}/g, recipientName || 'Coordinator')
        .replace(/{{city}}/g, 'Nagpur')
        .replace(/{{area}}/g, 'Nagpur')
        .replace(/{{tsm_name}}/g, 'Swapnil')
        .replace(/{{brochure_url}}/g, `${window.location.origin}/share/brochure/${targetSchool.id}`);
      setCustomText(tplText);
    }
  };

  const handleSend = async () => {
    if (!mobileNumber.trim()) return;
    setIsSending(true);
    try {
      const res = await sendWhatsAppMessage({
        schoolId: targetSchool.id,
        recipientPhone: mobileNumber,
        recipientName: recipientName,
        designation: targetSchool.designation || 'PRINCIPAL',
        templateId: selectedTemplateId,
        customText: customText
      });

      setGeneratedUrl(res.whatsappUrl);
      // Automatically open wa.me link in a new tab so user can send immediately
      window.open(res.whatsappUrl, '_blank');

      if (onSentSuccess) onSentSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-green-600 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">1-Click WhatsApp Outreach</h3>
              <div className="text-xs text-gray-500 truncate max-w-xs">{targetSchool.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SilverZone 2026-27 Registration Extension Notice */}
        <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-extrabold text-rose-900 flex items-center space-x-1">
              <span>📢 Registration Extended Till 30th/31st Sept 2026</span>
            </div>
            <div className="text-[11px] text-rose-700">
              12 Olympiads + Little Star. Includes ISRO Educational Tour & ₹7.4 Cr awards.
            </div>
          </div>
          <a
            href={`${window.location.origin}/share/brochure/${targetSchool.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shrink-0 flex items-center space-x-1"
          >
            <span>View Prospectus</span>
          </a>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Recipient Phone & Name */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-gray-600 font-medium block mb-1">Recipient Mobile *</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-900 font-mono focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-medium block mb-1">Contact Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Dr. Sunita Deshpande"
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="text-gray-600 font-medium block mb-1">Select Sales Template</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-900 cursor-pointer focus:border-indigo-600 focus:bg-white focus:outline-none"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Custom / Rendered Text */}
          <div>
            <label className="text-gray-600 font-medium block mb-1">Message Preview (Editable)</label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-900 text-xs font-sans leading-relaxed focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>

          {generatedUrl && (
            <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-800 flex items-center justify-between">
              <span className="text-[11px] font-mono truncate max-w-xs">
                WhatsApp Link Ready: {generatedUrl}
              </span>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-green-600 px-2.5 py-1 rounded hover:bg-green-700 shrink-0 ml-2"
              >
                Open WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-200">
          <span className="text-[11px] text-gray-500">
            Links with any mobile browser or WhatsApp desktop
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !mobileNumber.trim()}
              className="px-4 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch 1-Click WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
