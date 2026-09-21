import React, { useState, useMemo, useEffect } from 'react';
import {
  CompleteAssessmentData,
  ParameterAssessment,
  HealthRating,
  CompositeRating,
  DocumentChecklistItem,
  RecommendationItem,
  AssessmentProfile,
  DimensionSummaryDetail,
  PerceptionSurveyData
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
import { PerceptionSurveyView } from './components/PerceptionSurveyView';
import { FollowUpMonitoring } from './components/FollowUpMonitoring';
import { OfficialReportView } from './components/OfficialReportView';
import { ProfileModal } from './components/ProfileModal';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleUpdatePerceptionSurvey = (surveyData: PerceptionSurveyData) => {
    setAssessmentData(prev => ({
      ...prev,
      perceptionSurvey: surveyData
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
    } else if (tab === 'persepsi' || tab === 'survei') {
      setActiveTab('perception');
    } else if (tab === 'laporan') {
      setActiveTab('report');
    } else {
      setActiveTab(tab as NavTabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 antialiased selection:bg-[#6531F7] selection:text-white relative">
      {/* Dynamic Animated Ambient Liquid Orbs in Background (GPU Hardware Accelerated) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Orb 1: Top Right Sky-Indigo Luminous Float */}
        <div className="animate-orb-1 absolute -top-36 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-300/40 via-purple-300/30 to-sky-200/45 blur-3xl" />

        {/* Orb 2: Center Left Vibrant Violet-Pink Glow */}
        <div className="animate-orb-2 absolute top-1/4 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-fuchsia-300/30 via-[#6531F7]/15 to-purple-200/40 blur-3xl" />

        {/* Orb 3: Bottom Center Lavender & Cyan Aura */}
        <div className="animate-orb-3 absolute -bottom-40 right-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-purple-400/25 via-violet-300/20 to-sky-300/35 blur-3xl" />
      </div>

      {/* Outer Container with Floating Sticky Sidebar + Main Content Layout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto p-3 sm:p-4 gap-3 sm:gap-4 relative items-start">
        {/* Desktop Sticky Side Menu (Always Sticky on Viewport Scroll) */}
        <div className="hidden md:block shrink-0 sticky top-3 sm:top-4 self-start z-30">
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
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              className="absolute left-3 top-3 bottom-3 w-72 z-50"
              onClick={e => e.stopPropagation()}
            >
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

          {/* Active View Container with Silk-Smooth Page Transition */}
          <main className="flex-1 min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
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

                {activeTab === 'perception' && (
                  <PerceptionSurveyView
                    assessmentData={assessmentData}
                    calculation={calculation}
                    onUpdatePerceptionSurvey={handleUpdatePerceptionSurvey}
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
                    onUpdateRecommendations={handleUpdateRecommendations}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
