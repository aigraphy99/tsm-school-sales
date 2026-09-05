import React from 'react';
import {
  LayoutDashboard,
  Table2,
  Kanban,
  Flame,
  Globe2,
  AlertTriangle,
  MessageSquareText,
  Award,
  MapPin,
  FileSpreadsheet,
  ShieldCheck,
  Server,
  Smartphone,
  BookOpen,
  ShieldAlert
} from 'lucide-react';

export type ActiveTab =
  | 'COMMAND_CENTER'
  | 'ADMIN_PANEL'
  | 'SCHOOLS_TABLE'
  | 'PIPELINE'
  | 'WAR_ROOM'
  | 'TRUECALLER_VERIFY'
  | 'BROCHURE_EXPLORER'
  | 'RESEARCH_CENTER'
  | 'CONFLICTS'
  | 'WHATSAPP_CENTER'
  | 'OPPORTUNITIES'
  | 'TERRITORY_MAP'
  | 'IMPORT_EXPORT'
  | 'AUDIT_TRAIL'
  | 'DEPLOYMENT';

interface ActivityRailProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingConflictsCount: number;
  activeResearchCount: number;
}

export const ActivityRail: React.FC<ActivityRailProps> = ({
  activeTab,
  onTabChange,
  pendingConflictsCount,
  activeResearchCount
}) => {
  const items: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'COMMAND_CENTER',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'ADMIN_PANEL',
      label: 'Master Admin Panel & Fees',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
    },
    {
      id: 'SCHOOLS_TABLE',
      label: 'Schools Master Data Grid',
      icon: <Table2 className="w-5 h-5" />
    },
    {
      id: 'PIPELINE',
      label: 'Pipeline Kanban',
      icon: <Kanban className="w-5 h-5" />
    },
    {
      id: 'WAR_ROOM',
      label: '5-Day War Room',
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: 'TRUECALLER_VERIFY',
      label: 'Truecaller Accuracy',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 'BROCHURE_EXPLORER',
      label: 'SilverZone Brochure (Ext: 30/31 Sept)',
      icon: <BookOpen className="w-5 h-5" />,
      badge: 1,
      badgeColor: 'bg-rose-600'
    },
    {
      id: 'RESEARCH_CENTER',
      label: 'Web Research Scraper',
      icon: <Globe2 className="w-5 h-5" />,
      badge: activeResearchCount > 0 ? activeResearchCount : undefined,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'CONFLICTS',
      label: 'Data Quality & Conflicts',
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: pendingConflictsCount > 0 ? pendingConflictsCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'WHATSAPP_CENTER',
      label: 'WhatsApp Outreach',
      icon: <MessageSquareText className="w-5 h-5" />
    },
    {
      id: 'OPPORTUNITIES',
      label: 'Olympiad & Books',
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 'TERRITORY_MAP',
      label: 'Territory Map & Visits',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'IMPORT_EXPORT',
      label: 'CSV Import & Reconcile',
      icon: <FileSpreadsheet className="w-5 h-5" />
    },
    {
      id: 'AUDIT_TRAIL',
      label: 'Audit Trail',
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: 'DEPLOYMENT',
      label: 'Hoster & VPS Deploy',
      icon: <Server className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-2 select-none z-20 shrink-0 shadow-xs">
      <div className="flex-1 flex flex-col space-y-1.5 w-full px-1.5">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative w-full h-11 rounded flex flex-col items-center justify-center transition-all group cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              {/* Left active indicator strip */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r" />
              )}
              {item.icon}

              {/* Badges */}
              {item.badge !== undefined && (
                <span
                  className={`absolute top-1 right-1 text-[9px] font-bold text-white px-1 rounded-full ${
                    item.badgeColor === 'bg-amber-500' ? 'bg-orange-600' : 'bg-indigo-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
