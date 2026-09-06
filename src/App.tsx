/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, Territory, School, DailyStats, NextActionItem, PipelineStage } from './types.js';
import {
  fetchMe,
  switchUser,
  fetchSchools,
  fetchSchoolById,
  fetchDashboardStats,
  fetchNextActions,
  fetchConflicts,
  updateSchoolStage,
  startSchoolResearch,
  startBatchResearch
} from './api.js';

import { TopCommandBar } from './components/Navigation/TopCommandBar.js';
import { ActivityRail, ActiveTab } from './components/Navigation/ActivityRail.js';
import { StatusBar } from './components/Navigation/StatusBar.js';
import { CommandPalette } from './components/Navigation/CommandPalette.js';

import { CommandCenter } from './components/Dashboard/CommandCenter.js';
import { SchoolsTable } from './components/Schools/SchoolsTable.js';
import { School360 } from './components/Schools/School360.js';
import { AddSchoolModal } from './components/Schools/AddSchoolModal.js';
import { WarRoomView } from './components/WarRoom/WarRoomView.js';
import { ResearchCenter } from './components/Research/ResearchCenter.js';
import { WhatsAppCenter } from './components/WhatsApp/WhatsAppCenter.js';
import { QuickSendModal } from './components/WhatsApp/QuickSendModal.js';
import { PipelineView } from './components/Pipeline/PipelineView.js';
import { TerritoryMapView } from './components/Map/TerritoryMapView.js';
import { OpportunitiesView } from './components/Opportunities/OpportunitiesView.js';
import { CsvImportView } from './components/Import/CsvImportView.js';
import { AuditLogView } from './components/Audit/AuditLogView.js';
import { DeploymentView } from './components/Deployment/DeploymentView.js';
import { BrochureExplorerView } from './components/Brochure/BrochureExplorerView.js';
import { BrochureViewerModal } from './components/Brochure/BrochureViewerModal.js';
import { AdminMasterPanel } from './components/Admin/AdminMasterPanel.js';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<ActiveTab>('COMMAND_CENTER');
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>('terr-nagpur');

  // Schools Data State
  const [schools, setSchools] = useState<School[]>([]);
  const [totalSchools, setTotalSchools] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBoard, setFilterBoard] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [filterUnverifiedOnly, setFilterUnverifiedOnly] = useState<boolean>(false);

  // Operations & Telemetry Data
  const [dashboardStats, setDashboardStats] = useState<DailyStats | null>(null);
  const [nextActions, setNextActions] = useState<NextActionItem[]>([]);
  const [pendingConflictsCount, setPendingConflictsCount] = useState<number>(0);

  // Modals & Panels
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedSchoolFullData, setSelectedSchoolFullData] = useState<any | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState<boolean>(false);
  const [quickWhatsAppTarget, setQuickWhatsAppTarget] = useState<{
    id: string;
    name: string;
    phone?: string;
    contactName?: string;
    designation?: string;
  } | null>(null);

  // Initial Load: User & Territories
  useEffect(() => {
    fetchMe()
      .then((data) => {
        setCurrentUser(data.user);
        setAvailableUsers(data.availableUsers);
        setTerritories(data.territories);
        if (data.user?.territoryId) {
          setSelectedTerritoryId(data.user.territoryId);
        }
      })
      .catch((err) => console.error('Error initializing user:', err));
  }, []);

  // Reload Schools list
  const loadSchools = useCallback(async () => {
    try {
      const res = await fetchSchools({
        search: searchQuery || undefined,
        territoryId: selectedTerritoryId === 'terr-all' ? undefined : selectedTerritoryId,
        board: filterBoard === 'ALL' ? undefined : filterBoard,
        priority: filterPriority === 'ALL' ? undefined : filterPriority,
        stage: filterStage === 'ALL' ? undefined : filterStage,
        unverifiedOnly: filterUnverifiedOnly || undefined,
        page: currentPage,
        limit: 25
      });
      setSchools(res.schools || []);
      setTotalSchools(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  }, [
    searchQuery,
    selectedTerritoryId,
    filterBoard,
    filterPriority,
    filterStage,
    filterUnverifiedOnly,
    currentPage
  ]);

  // Reload Dashboard & Next Actions
  const loadStatsAndActions = useCallback(async () => {
    try {
      const [stats, actions, conflicts] = await Promise.all([
        fetchDashboardStats(),
        fetchNextActions(),
        fetchConflicts()
      ]);
      if (stats) setDashboardStats(stats);
      if (actions) setNextActions(actions);
      if (Array.isArray(conflicts)) {
        setPendingConflictsCount(conflicts.filter((c) => c.status === 'PENDING').length);
      }
    } catch (err) {
      console.warn('Dashboard stats temporarily synchronizing:', err);
    }
  }, []);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    loadStatsAndActions();
    const timer = setInterval(loadStatsAndActions, 10000);
    return () => clearInterval(timer);
  }, [loadStatsAndActions]);

  // Load School 360 Full Record
  useEffect(() => {
    if (selectedSchoolId) {
      fetchSchoolById(selectedSchoolId)
        .then((data) => setSelectedSchoolFullData(data))
        .catch((err) => console.error(err));
    } else {
      setSelectedSchoolFullData(null);
    }
  }, [selectedSchoolId]);

  // User Switcher handler
  const handleSwitchUser = async (userId: string) => {
    const res = await switchUser(userId);
    if (res.success) {
      setCurrentUser(res.user);
      if (res.user.territoryId) {
        setSelectedTerritoryId(res.user.territoryId);
      }
      loadSchools();
      loadStatsAndActions();
    }
  };

  // Stage change handler
  const handleStageChange = async (schoolId: string, newStage: PipelineStage) => {
    await updateSchoolStage(schoolId, newStage);
    loadSchools();
    loadStatsAndActions();
    if (selectedSchoolId === schoolId) {
      fetchSchoolById(schoolId).then((data) => setSelectedSchoolFullData(data));
    }
  };

  // Run research crawler on single school
  const handleResearchSchool = async (schoolId: string) => {
    await startSchoolResearch(schoolId);
    loadSchools();
    loadStatsAndActions();
  };

  // Bulk crawler trigger
  const handleBulkResearch = async (schoolIds: string[]) => {
    await startBatchResearch(undefined, schoolIds);
    loadSchools();
    loadStatsAndActions();
  };

  const selectedTerritoryName =
    selectedTerritoryId === 'terr-all'
      ? 'All India'
      : territories.find((t) => t.id === selectedTerritoryId)?.name || 'Nagpur District';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F3F4F6] text-gray-900 font-sans">
      {/* 1. Top Command Bar (High Density Style) */}
      <TopCommandBar
        currentUser={currentUser}
        territories={territories}
        selectedTerritoryId={selectedTerritoryId}
        onSelectTerritory={(id) => {
          setSelectedTerritoryId(id);
          setCurrentPage(1);
        }}
        availableUsers={availableUsers}
        onSwitchUser={handleSwitchUser}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAddSchool={() => setIsAddSchoolOpen(true)}
        onOpenImport={() => setActiveTab('IMPORT_EXPORT')}
        onOpenWarRoom={() => setActiveTab('WAR_ROOM')}
        onOpenDeployment={() => setActiveTab('DEPLOYMENT')}
        onOpenBrochure={() => setIsBrochureModalOpen(true)}
        onOpenAdmin={() => setActiveTab('ADMIN_PANEL')}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      {/* 2. Middle Body: Left Activity Rail + Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Rail */}
        <ActivityRail
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingConflictsCount={pendingConflictsCount}
          activeResearchCount={0}
        />

        {/* Main Workspace Stage */}
        <main className="flex-1 overflow-y-auto bg-[#F3F4F6] p-3 md:p-4">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'COMMAND_CENTER' && (
              <CommandCenter
                user={currentUser}
                stats={dashboardStats}
                nextActions={nextActions}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onOpenQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
                onOpenWarRoom={() => setActiveTab('WAR_ROOM')}
                onOpenResearch={() => setActiveTab('RESEARCH_CENTER')}
                onOpenConflicts={() => setActiveTab('CONFLICTS')}
                pendingConflictsCount={pendingConflictsCount}
              />
            )}

            {activeTab === 'ADMIN_PANEL' && (
              <AdminMasterPanel
                onRefreshAll={() => {
                  loadSchools();
                  loadStatsAndActions();
                }}
              />
            )}

            {activeTab === 'SCHOOLS_TABLE' && (
              <SchoolsTable
                schools={schools}
                totalSchools={totalSchools}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onStageChange={handleStageChange}
                onResearchSchool={handleResearchSchool}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
                onBulkResearch={handleBulkResearch}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                filterBoard={filterBoard}
                onFilterBoardChange={(b) => {
                  setFilterBoard(b);
                  setCurrentPage(1);
                }}
                filterPriority={filterPriority}
                onFilterPriorityChange={(p) => {
                  setFilterPriority(p);
                  setCurrentPage(1);
                }}
                filterStage={filterStage}
                onFilterStageChange={(s) => {
                  setFilterStage(s);
                  setCurrentPage(1);
                }}
                filterUnverifiedOnly={filterUnverifiedOnly}
                onFilterUnverifiedChange={(val) => {
                  setFilterUnverifiedOnly(val);
                  setCurrentPage(1);
                }}
              />
            )}

            {activeTab === 'PIPELINE' && (
              <PipelineView
                schools={schools}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onStageChange={handleStageChange}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
              />
            )}

            {activeTab === 'WAR_ROOM' && (
              <WarRoomView
                stats={dashboardStats}
                schools={schools}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onOpenSchoolsTab={() => setActiveTab('SCHOOLS_TABLE')}
              />
            )}

            {activeTab === 'TRUECALLER_VERIFY' && (
              <ResearchCenter
                initialSubTab="TRUECALLER"
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
              />
            )}

            {activeTab === 'BROCHURE_EXPLORER' && (
              <BrochureExplorerView
                schools={schools}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
              />
            )}

            {activeTab === 'RESEARCH_CENTER' && (
              <ResearchCenter
                initialSubTab="CRAWLER"
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
              />
            )}

            {activeTab === 'CONFLICTS' && (
              <ResearchCenter
                initialSubTab="CONFLICTS"
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                onQuickWhatsApp={(school) => setQuickWhatsAppTarget(school)}
              />
            )}

            {activeTab === 'WHATSAPP_CENTER' && (
              <WhatsAppCenter onSelectSchool={(id) => setSelectedSchoolId(id)} />
            )}

            {activeTab === 'OPPORTUNITIES' && (
              <OpportunitiesView
                schools={schools}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
              />
            )}

            {activeTab === 'TERRITORY_MAP' && (
              <TerritoryMapView
                schools={schools}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
              />
            )}

            {activeTab === 'IMPORT_EXPORT' && (
              <CsvImportView
                onImportComplete={() => {
                  loadSchools();
                  loadStatsAndActions();
                }}
              />
            )}

            {activeTab === 'AUDIT_TRAIL' && <AuditLogView />}

            {activeTab === 'DEPLOYMENT' && <DeploymentView />}
          </div>
        </main>
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar
        user={currentUser}
        territoryName={selectedTerritoryName}
        stats={dashboardStats}
        totalSchools={totalSchools}
        onOpenWarRoom={() => setActiveTab('WAR_ROOM')}
        onOpenConflicts={() => setActiveTab('CONFLICTS')}
        pendingConflictsCount={pendingConflictsCount}
      />

      {/* 4. Global Modals & Drawers */}
      {/* School 360 Drawer */}
      {selectedSchoolId && (
        <School360
          schoolId={selectedSchoolId}
          schoolData={selectedSchoolFullData}
          onClose={() => setSelectedSchoolId(null)}
          onRefresh={() => {
            fetchSchoolById(selectedSchoolId).then((data) => setSelectedSchoolFullData(data));
            loadSchools();
            loadStatsAndActions();
          }}
          onQuickWhatsApp={(target) => setQuickWhatsAppTarget(target)}
        />
      )}

      {/* 1-Click WhatsApp Modal */}
      <QuickSendModal
        isOpen={Boolean(quickWhatsAppTarget)}
        onClose={() => setQuickWhatsAppTarget(null)}
        targetSchool={quickWhatsAppTarget}
        onSentSuccess={() => {
          loadStatsAndActions();
          loadSchools();
        }}
      />

      {/* Add School Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        onAddSuccess={() => {
          loadSchools();
          loadStatsAndActions();
        }}
        territoryId={selectedTerritoryId === 'terr-all' ? 'terr-nagpur' : selectedTerritoryId}
      />

      {/* Cmd+K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        schools={schools}
        onSelectSchool={(id) => setSelectedSchoolId(id)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenImport={() => setActiveTab('IMPORT_EXPORT')}
        onOpenDeployment={() => setActiveTab('DEPLOYMENT')}
      />

      {/* SilverZone 2026-27 Brochure & Extension Modal */}
      <BrochureViewerModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        onLaunchWhatsApp={(templateId) => {
          setIsBrochureModalOpen(false);
          const firstSchool = schools[0];
          if (firstSchool) {
            setQuickWhatsAppTarget({
              id: firstSchool.id,
              name: firstSchool.name,
              phone: firstSchool.contacts?.[0]?.phone || firstSchool.phone,
              contactName: firstSchool.contacts?.[0]?.name || 'Principal',
              designation: 'PRINCIPAL'
            });
          }
        }}
      />
    </div>
  );
}
