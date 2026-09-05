import React from 'react';
import { Award, BookOpen, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { School, Opportunity } from '../../types.js';

interface OpportunitiesViewProps {
  schools: School[];
  onSelectSchool: (schoolId: string) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ schools, onSelectSchool }) => {
  // Extract all opportunities across schools
  const allOpps = schools.flatMap((s) =>
    (s.opportunities || []).map((opp) => ({
      ...opp,
      schoolName: s.name,
      schoolArea: s.area,
      schoolId: s.id
    }))
  );

  const totalPipelineValue = allOpps.reduce((sum, o) => sum + o.potentialValue, 0);
  const totalOlympiadDeals = allOpps.filter((o) => o.type === 'OLYMPIAD').length;
  const totalBookDeals = allOpps.filter((o) => o.type === 'BOOK_SUBSCRIPTION').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-mono font-bold text-orange-700 uppercase tracking-wider">
                Commercial Pipeline
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Olympiad Registrations & Textbook Subscriptions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live tracking of exam registrations, sample specimen sets delivered, and closing dates.
            </p>
          </div>

          <div className="bg-indigo-900 text-white rounded-lg p-3 text-right shrink-0 shadow-sm">
            <div className="text-[10px] uppercase font-mono text-indigo-200">Total Active Pipeline</div>
            <div className="text-2xl font-black text-green-300 font-mono mt-0.5">
              ₹{totalPipelineValue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-indigo-200 mt-0.5">
              {totalOlympiadDeals} Olympiad Deals • {totalBookDeals} Book Deals
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-900">Deal Registry ({allOpps.length})</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {allOpps.map((opp) => (
            <div
              key={opp.id}
              className="p-3 hover:bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-900">{opp.product}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 font-bold">
                    {opp.type}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                    {opp.stage}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-0.5 flex items-center space-x-2">
                  <button
                    onClick={() => onSelectSchool(opp.schoolId)}
                    className="text-indigo-700 hover:underline font-semibold"
                  >
                    {opp.schoolName}
                  </button>
                  <span>•</span>
                  <span>{opp.schoolArea}</span>
                </div>

                <div className="text-xs text-gray-700 mt-1">
                  Next Step: <strong className="text-gray-900">{opp.nextAction}</strong>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-base font-black text-green-700 font-mono">
                    ₹{opp.potentialValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    Prob: {Math.round(opp.probability * 100)}%
                  </div>
                </div>

                <button
                  onClick={() => onSelectSchool(opp.schoolId)}
                  className="p-1.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs cursor-pointer"
                  title="Open School 360"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
