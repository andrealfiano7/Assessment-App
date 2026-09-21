import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileSpreadsheet,
  Activity,
  Target,
  FileCheck2,
  ListChecks,
  Award,
  ChevronRight,
  Sparkles,
  Shield,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { AssessmentProfile } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { motion } from 'framer-motion';

export type NavTabId =
  | 'dashboard'
  | 'assessment'
  | 'lampiran4'
  | 'performance'
  | 'checklist'
  | 'gap'
  | 'monitoring'
  | 'report';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  profile: AssessmentProfile;
  calculation: CalculationResult;
  onOpenProfile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  assessedCount: number;
  totalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  calculation,
  onOpenProfile,
  isCollapsed,
  onToggleCollapse,
  assessedCount,
  totalCount
}) => {
  const modelLabel =
    profile.model === 'umum'
      ? 'Umum (42 Param)'
      : profile.model === 'perbankan'
      ? 'Perbankan (40 Param)'
      : 'Asuransi (40 Param)';

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'dashboard' as NavTabId,
          label: 'Dashboard',
          sublabel: 'Ringkasan Eksekutif',
          icon: LayoutDashboard,
          badge: `${calculation.finalRmiScore.toFixed(2)}`
        },
        {
          id: 'assessment' as NavTabId,
          label: 'Evaluasi Parameter',
          sublabel: 'Penilaian 5 Dimensi',
          icon: ClipboardCheck,
          badge: `${assessedCount}/${totalCount}`
        },
        {
          id: 'lampiran4' as NavTabId,
          label: 'Kertas Kerja IV',
          sublabel: 'Lampiran IV.A, B, C',
          icon: FileSpreadsheet,
          badge: 'SK-8'
        }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        {
          id: 'performance' as NavTabId,
          label: 'Kinerja BUMN',
          sublabel: 'Rating & Penyesuaian',
          icon: Activity,
          badge: calculation.isAdjustmentApplicable ? 'Aktif' : 'N/A'
        },
        {
          id: 'gap' as NavTabId,
          label: 'Celah & Prioritas',
          sublabel: 'Matriks 4 Kuadran',
          icon: Target
        },
        {
          id: 'checklist' as NavTabId,
          label: 'Checklist Dokumen',
          sublabel: '168 Berkas Verifikasi',
          icon: FileCheck2
        }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        {
          id: 'monitoring' as NavTabId,
          label: 'Tindak Lanjut',
          sublabel: 'Pemantauan Triwulan',
          icon: ListChecks
        },
        {
          id: 'report' as NavTabId,
          label: 'Laporan Resmi',
          sublabel: 'Format Baku KBUMN',
          icon: Award
        }
      ]
    }
  ];

  return (
    <aside
      className={`glass-sidebar print:hidden sticky top-4 h-[calc(100vh-2rem)] flex flex-col justify-between shrink-0 z-30 transition-all duration-300 ${
        isCollapsed ? 'w-20 p-2.5' : 'w-64 p-3.5'
      }`}
    >
      {/* Top Part: Workspace/Profile Card + Menu Groups */}
      <div className="flex flex-col min-h-0">
        {/* Workspace Card (Flowly Style from UI Kit) */}
        <div className="mb-3.5 pb-3 border-b border-white/80">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl hover:bg-white/60 transition group">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                title="Klik untuk ubah profil BUMN"
              >
                {/* Logo Squircle with specular highlight */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6531F7] to-[#AB68FF] p-0.5 shadow-[0_0_12px_rgba(101,49,247,0.35)] shrink-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-white/15 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900 truncate leading-tight flex items-center gap-1">
                    <span>{profile.companyName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {modelLabel}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={onOpenProfile}
                  className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition"
                  title="Profil BUMN"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggleCollapse}
                  className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-[#6531F7] transition"
                  title="Ciutkan Sidebar"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6531F7] to-[#AB68FF] p-0.5 shadow-[0_0_12px_rgba(101,49,247,0.35)] flex items-center justify-center cursor-pointer transition hover:scale-105"
                title={`${profile.companyName} (${modelLabel})`}
              >
                <div className="w-full h-full rounded-[14px] bg-white/15 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
              </button>
              <button
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-lg hover:bg-white/80 flex items-center justify-center text-slate-400 hover:text-[#6531F7] transition"
                title="Bentangkan Sidebar"
              >
                <PanelLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="overflow-y-auto no-scrollbar space-y-4 flex-1 pr-0.5">
          {navGroups.map(group => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] font-extrabold tracking-wider text-slate-400 px-3 py-1 uppercase">
                  {group.title}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: isCollapsed ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectTab(item.id)}
                      className={`relative w-full flex items-center transition-colors rounded-xl text-left group z-10 ${
                        isCollapsed
                          ? 'justify-center p-2.5'
                          : 'px-2.5 py-2'
                      } ${
                        isActive
                          ? 'text-slate-900 font-bold'
                          : 'hover:bg-white/40 text-slate-600 hover:text-slate-900'
                      }`}
                      title={isCollapsed ? `${item.label} (${item.sublabel})` : undefined}
                    >
                      {/* Unified Animated Active Gliding Pill & Purple Bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarPill"
                          className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white/90 -z-10 flex items-center pl-2.5 pointer-events-none"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        >
                          {!isCollapsed && (
                            <div className="w-1 h-5 bg-[#6531F7] rounded-full shadow-[0_0_8px_rgba(101,49,247,0.6)]" />
                          )}
                        </motion.div>
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ml-3 ${
                          isActive
                            ? 'text-[#6531F7]'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="min-w-0 flex-1 ml-2.5 flex items-center justify-between">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 font-bold ${
                                isActive
                                  ? 'bg-[#6531F7]/10 text-[#6531F7]'
                                  : 'bg-slate-100/80 text-slate-500'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Part: Live RMI Hub Pill (UI Kit "AI Insight Hub" Style) */}
      <div className="pt-3 border-t border-white/80 mt-2 shrink-0">
        {!isCollapsed ? (
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTab('dashboard')}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#6531F7] to-[#804DF8] text-white shadow-[0_0_16px_rgba(101,49,247,0.40)] cursor-pointer hover:shadow-[0_0_24px_rgba(101,49,247,0.6)] transition group relative overflow-hidden"
          >
            {/* Ambient Shimmer Sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-tight text-white leading-none">
                    Skor RMI Live
                  </div>
                  <div className="text-[10px] text-purple-100/80 mt-0.5 font-medium">
                    {calculation.maturityPhase.subLevel}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black tracking-tight text-white">
                  {calculation.finalRmiScore.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTab('dashboard')}
            className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-r from-[#6531F7] to-[#804DF8] text-white shadow-[0_0_14px_rgba(101,49,247,0.44)] flex items-center justify-center cursor-pointer"
            title={`Skor RMI: ${calculation.finalRmiScore.toFixed(2)} (${calculation.maturityPhase.subLevel})`}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </motion.button>
        )}
      </div>
    </aside>
  );
};
