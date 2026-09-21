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
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.aside
      layout="position"
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className={`glass-sidebar print:hidden sticky top-3 sm:top-4 h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] flex flex-col justify-between shrink-0 z-30 overflow-hidden ${
        isCollapsed ? 'p-2' : 'p-3.5'
      }`}
    >
      {/* Top Part: Workspace/Profile Card + Menu Groups */}
      <div className="flex flex-col min-h-0">
        {/* Workspace Card (Flowly Style from UI Kit) */}
        <div className="mb-3 pb-3 border-b border-white/80">
          <div className="flex items-center justify-between gap-1 p-1 rounded-2xl hover:bg-white/60 transition group">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 min-w-0 text-left flex-1 cursor-pointer"
              title={`${profile.companyName} (${modelLabel})`}
            >
              {/* Logo Squircle with specular highlight */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6531F7] to-[#AB68FF] p-0.5 shadow-[0_0_12px_rgba(101,49,247,0.35)] shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[10px] bg-white/15 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0 flex-1 overflow-hidden whitespace-nowrap pl-1"
                  >
                    <div className="text-xs font-extrabold text-slate-900 truncate leading-tight">
                      {profile.companyName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {modelLabel}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center gap-0.5 shrink-0">
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.button
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={onOpenProfile}
                    className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition cursor-pointer overflow-hidden"
                    title="Profil BUMN"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-[#6531F7] transition cursor-pointer shrink-0"
                title={isCollapsed ? 'Bentangkan Sidebar' : 'Ciutkan Sidebar'}
              >
                {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="overflow-y-auto no-scrollbar space-y-4 flex-1 pr-0.5">
          {navGroups.map(group => (
            <div key={group.title} className="space-y-1">
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-[10px] font-extrabold tracking-wider text-slate-400 px-3 py-1 uppercase overflow-hidden whitespace-nowrap"
                  >
                    {group.title}
                  </motion.div>
                )}
              </AnimatePresence>

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
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          !isCollapsed ? 'ml-3' : ''
                        } ${
                          isActive
                            ? 'text-[#6531F7]'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />

                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="min-w-0 flex-1 ml-2.5 flex items-center justify-between overflow-hidden whitespace-nowrap"
                          >
                            <span className="text-xs truncate font-semibold">{item.label}</span>
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Part: Live RMI Hub Pill with Vivid, High-Contrast Colorful Text */}
      <div className="pt-2.5 border-t border-white/80 mt-2 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {!isCollapsed ? (
            <motion.div
              key="expanded-hub"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab('dashboard')}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#4A10D9] via-[#6531F7] to-[#7E3AF2] text-white border border-white/30 shadow-[0_6px_22px_rgba(101,49,247,0.40)] cursor-pointer hover:shadow-[0_10px_28px_rgba(101,49,247,0.55)] transition group relative overflow-hidden"
            >
              {/* Ambient Specular Shimmer Sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,199,89,1)]"></span>
                      <span className="text-xs font-black tracking-tight text-white drop-shadow-sm">
                        Skor RMI Live
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white shadow-xs backdrop-blur-xs truncate max-w-[110px]">
                        {calculation.maturityPhase.subLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right pl-2 shrink-0">
                  <span className="text-xl font-black tracking-tight text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] block">
                    {calculation.finalRmiScore.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-bold text-purple-200 block">
                    / 5.00
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed-hub"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTab('dashboard')}
              className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#4A10D9] via-[#6531F7] to-[#7E3AF2] text-white border border-white/30 shadow-[0_6px_18px_rgba(101,49,247,0.40)] flex flex-col items-center justify-center cursor-pointer p-1"
              title={`Skor RMI: ${calculation.finalRmiScore.toFixed(2)} (${calculation.maturityPhase.subLevel})`}
            >
              <span className="text-xs font-black text-amber-300 leading-none drop-shadow-sm">
                {calculation.finalRmiScore.toFixed(2)}
              </span>
              <span className="text-[9px] font-extrabold text-white leading-tight mt-0.5">
                RMI
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
