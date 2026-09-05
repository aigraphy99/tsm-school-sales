import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { School, PipelineStage } from '../../types.js';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  territoryId: string;
}

export const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
  territoryId
}) => {
  const [name, setName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [area, setArea] = useState('Dharampeth');
  const [city, setCity] = useState('Nagpur');
  const [board, setBoard] = useState('CBSE');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P1');
  const [studentStrength, setStudentStrength] = useState('1200');
  const [phone, setPhone] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: name.trim(),
        schoolCode: schoolCode.trim() || `NGP-${Math.floor(1000 + Math.random() * 9000)}`,
        area: area.trim(),
        city: city.trim(),
        state: 'Maharashtra',
        pincode: '440010',
        board,
        priority,
        studentStrength: parseInt(studentStrength) || 1000,
        officialPhone: phone.trim(),
        territoryId,
        ownerTsmId: 'usr-1',
        ownerTsmName: 'Swapnil (TSM)',
        stage: 'DATA_VERIFIED' as PipelineStage,
        contactsCount: principalName.trim() ? 1 : 0
      };

      await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      onAddSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-gray-300 rounded-lg max-w-lg w-full p-4 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-700" />
            <h3 className="text-sm font-bold text-gray-900">Add New Institutional Record</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">School Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Somalwar High School"
              className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Area / Locality</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Ramdaspeth"
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 cursor-pointer focus:border-indigo-600 focus:outline-none"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 cursor-pointer focus:border-indigo-600 focus:outline-none"
              >
                <option value="P1">P1 (High)</option>
                <option value="P2">P2 (Standard)</option>
                <option value="P3">P3 (Nurture)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Student Strength</label>
              <input
                type="number"
                value={studentStrength}
                onChange={(e) => setStudentStrength(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Principal Name</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="e.g. Dr. A. Sharma"
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Mobile / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              Save School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
