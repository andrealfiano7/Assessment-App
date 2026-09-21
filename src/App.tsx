import React, { useState, useMemo, useEffect } from 'react';
import {
  CompleteAssessmentData,
  ParameterAssessment,
  HealthRating,
  CompositeRating,
  DocumentChecklistItem,
  RecommendationItem,
  AssessmentProfile,
  DimensionSummaryDetail
} from './types/rmi';
import { calculateRmi } from './utils/calculator';
import {
  loadCurrentAssessment,
  saveCurrentAssessment,
  getParametersForModel
} from './utils/storage';

import { Sidebar, NavTabId } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AssessmentView } from './components/AssessmentView';
import { LampiranIvView } from './components/LampiranIvView';
import { PerformanceView } from './components/PerformanceView';
import { DocumentChecklist } from './components/DocumentChecklist';
import { GapAnalysisView } from './components/GapAnalysisView';
import { FollowUpMonitoring } from './components/FollowUpMonitoring';
import { OfficialReportView } from './components/OfficialReportView';
import { ProfileModal } from './components/ProfileModal';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const [assessmentData, setAssessmentData] = useState<CompleteAssessmentData>(() => loadCurrentAssessment());
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    saveCurrentAssessment(assessmentData);
  }, [assessmentData]);

  const parameters = useMemo(() => {
    return getParametersForModel(assessmentData.profile.model);
  }, [assessmentData.profile.model]);

  const calculation = useMemo(() => {
    return calculateRmi(
      parameters,
      assessmentData.assessments,
      assessmentData.performance.healthRating,
      assessmentData.performance.compositeRating
    );
  }, [parameters, assessmentData.assessments, assessmentData.performance]);

  const handleUpdateAssessment = (paramId: number, update: Partial<ParameterAssessment>) => {
    setAssessmentData(prev => {
      const existing = prev.assessments[paramId] || { paramId, score: 0 };
      return {
        ...prev,
        assessments: {
          ...prev.assessments,
          [paramId]: {
            ...existing,
            ...update
          }
        }
      };
    });
  };

  const handleUpdatePerformance = (healthRating: HealthRating, compositeRating: CompositeRating) => {
    setAssessmentData(prev => ({
      ...prev,
      performance: {
        healthRating,
        compositeRating
      }
    }));
  };

  const handleUpdateChecklist = (documentChecklist: DocumentChecklistItem[]) => {
    setAssessmentData(prev => ({
      ...prev,
      documentChecklist
    }));
  };

  const handleUpdateRecommendations = (recommendations: RecommendationItem[]) => {
    setAssessmentData(prev => ({
      ...prev,
      recommendations
    }));
  };

  const handleSaveProfile = (profile: AssessmentProfile) => {
    setAssessmentData(prev => ({
      ...prev,
      profile
    }));
  };

  const handleUpdateDimensionSummary = (dimNum: number, summary: DimensionSummaryDetail) => {
    setAssessmentData(prev => ({
      ...prev,
      dimensionSummaries: {
        ...(prev.dimensionSummaries || {}),
        [dimNum]: summary
      }
    }));
  };

  const handleNewAssessment = (newData: CompleteAssessmentData) => {
    setAssessmentData(newData);
    setActiveTab('dashboard');
  };

  // Harmonized Tab Navigation Handler
  const handleNavigateTab = (tab: string) => {
    if (tab === 'penilaian') {
      setActiveTab('assessment');
    } else if (tab === 'kinerja') {
      setActiveTab('performance');
    } else if (tab === 'dokumen') {
      setActiveTab('checklist');
    } else if (tab === 'laporan') {
      setActiveTab('report');
    } else {
      setActiveTab(tab as NavTabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 antialiased selection:bg-[#6531F7] selection:text-white">
      {/* Outer Container with Floating Sticky Sidebar + Main Content Layout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto p-3 sm:p-4 gap-3 sm:gap-4 relative">
        {/* Desktop Sticky Side Menu (From UI Kit) */}
        <div className="hidden md:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            profile={assessmentData.profile}
            calculation={calculation}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
            assessedCount={calculation.totalAssessed}
            totalCount={calculation.totalParameters}
          />
        </div>

        {/* Mobile Slide-over Drawer Backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-sm p-4 flex"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div onClick={e => e.stopPropagation()} className="h-full">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={tab => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                profile={assessmentData.profile}
                calculation={calculation}
                onOpenProfile={() => {
                  setIsProfileModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
                assessedCount={calculation.totalAssessed}
                totalCount={calculation.totalParameters}
              />
            </div>
          </div>
        )}

        {/* Right Main Content Shell */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-4">
          {/* Top Bar Header */}
          <div className="print:hidden">
            <Header
              assessmentData={assessmentData}
              calculation={calculation}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
              onUpdateAssessmentData={setAssessmentData}
              onPrintReport={() => {
                setActiveTab('report');
                setTimeout(() => window.print(), 300);
              }}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            />
          </div>

          {/* Active View Container */}
          <main className="flex-1 min-h-0">
            {activeTab === 'dashboard' && (
              <Dashboard
                assessmentData={assessmentData}
                calculation={calculation}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentView
                assessmentData={assessmentData}
                onUpdateAssessment={handleUpdateAssessment}
              />
            )}

            {activeTab === 'lampiran4' && (
              <LampiranIvView
                assessmentData={assessmentData}
                parameters={parameters}
                calculation={calculation}
                onUpdateAssessment={handleUpdateAssessment}
                onUpdateRecommendations={handleUpdateRecommendations}
                onUpdateDimensionSummary={handleUpdateDimensionSummary}
                onNavigateToParam={() => setActiveTab('assessment')}
              />
            )}

            {activeTab === 'performance' && (
              <PerformanceView
                assessmentData={assessmentData}
                calculation={calculation}
                onUpdatePerformance={handleUpdatePerformance}
              />
            )}

            {activeTab === 'checklist' && (
              <DocumentChecklist
                assessmentData={assessmentData}
                onUpdateChecklist={handleUpdateChecklist}
              />
            )}

            {activeTab === 'gap' && (
              <GapAnalysisView
                assessmentData={assessmentData}
                calculation={calculation}
                onUpdateRecommendations={handleUpdateRecommendations}
              />
            )}

            {activeTab === 'monitoring' && (
              <FollowUpMonitoring
                assessmentData={assessmentData}
                onUpdateRecommendations={handleUpdateRecommendations}
              />
            )}

            {activeTab === 'report' && (
              <OfficialReportView
                assessmentData={assessmentData}
                calculation={calculation}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="print:hidden glass-card px-4 py-3 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-[#6531F7]/15 text-[#6531F7] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800">
                Sistem Pengukuran Indeks Kematangan Risiko (RMI) BUMN
              </span>
            </div>
            <p className="text-center sm:text-right text-slate-400">
              Keputusan Deputi Bidang Keuangan & Manajemen Risiko KBUMN No. SK-8/DKU.MBU/12/2023
            </p>
          </footer>
        </div>
      </div>

      {/* Profile & Setting Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={assessmentData.profile}
        onSaveProfile={handleSaveProfile}
        onNewAssessment={handleNewAssessment}
      />
    </div>
  );
}

export default App;
