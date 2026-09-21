import { CompleteAssessmentData, IndustryModel } from '../types/rmi';
import { getPtAbcSampleData } from '../data/sampleDataPtAbc';
import rmiUmumData from '../data/rmiUmum.json';
import rmiPerbankanData from '../data/rmiPerbankan.json';
import rmiAsuransiData from '../data/rmiAsuransi.json';
import checklistData from '../data/checklistDokumen.json';
import { isSupabaseConfigured, saveAssessmentToSupabase } from './supabaseClient';

const STORAGE_KEY_CURRENT = 'rmi_bumn_current_assessment_v1';
const STORAGE_KEY_ALL_PROFILES = 'rmi_bumn_saved_profiles_v1';

export function getParametersForModel(model: IndustryModel) {
  switch (model) {
    case 'perbankan':
      return rmiPerbankanData as any[];
    case 'asuransi':
      return rmiAsuransiData as any[];
    case 'umum':
    default:
      return rmiUmumData as any[];
  }
}

export function loadCurrentAssessment(): CompleteAssessmentData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load assessment from localStorage', e);
  }
  // Default to PT ABC sample
  const sample = getPtAbcSampleData();
  saveCurrentAssessment(sample);
  return sample;
}

export function saveCurrentAssessment(data: CompleteAssessmentData, finalScore?: number, maturityPhase?: string): void {
  try {
    data.profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(data));
    
    // Also update saved profiles index
    const profiles = getSavedProfilesList();
    const existingIdx = profiles.findIndex(p => p.id === data.profile.id);
    if (existingIdx >= 0) {
      profiles[existingIdx] = data.profile;
    } else {
      profiles.push(data.profile);
    }
    localStorage.setItem(STORAGE_KEY_ALL_PROFILES, JSON.stringify(profiles));

    // Cloud Backup ke Supabase jika konfigurasi aktif
    if (isSupabaseConfigured) {
      saveAssessmentToSupabase(data, finalScore, maturityPhase).catch(err => {
        console.warn('Background Supabase sync notice:', err);
      });
    }
  } catch (e) {
    console.error('Failed to save assessment to localStorage', e);
  }
}

export function getSavedProfilesList(): CompleteAssessmentData['profile'][] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_PROFILES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved profiles list', e);
  }
  return [];
}

export function createNewAssessment(
  companyName: string,
  year: number,
  model: IndustryModel,
  assessmentType: 'Internal' | 'Independen'
): CompleteAssessmentData {
  const newId = `assessment-${Date.now()}`;
  const newProfile = {
    id: newId,
    companyName,
    year,
    reportNumber: `01/RMI/${year}`,
    model,
    assessmentType,
    assessorName: assessmentType === 'Internal' ? 'Tim Penilai Internal Manajemen Risiko' : 'Penilai Independen Eksternal',
    observationPeriod: `1 Januari s.d. 31 Desember ${year - 1}`,
    assessmentDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const newData: CompleteAssessmentData = {
    profile: newProfile,
    assessments: {},
    performance: {
      healthRating: 'A',
      compositeRating: 2
    },
    documentChecklist: (checklistData as any[]).map(item => ({
      ...item,
      tersedia: false,
      catatan: ''
    })),
    recommendations: []
  };

  saveCurrentAssessment(newData);
  return newData;
}

export function exportAssessmentToJson(data: CompleteAssessmentData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RMI_${data.profile.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.profile.year}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAssessmentFromJson(jsonString: string): CompleteAssessmentData {
  const parsed = JSON.parse(jsonString);
  if (!parsed.profile || !parsed.assessments) {
    throw new Error('Format berkas JSON tidak valid untuk data penilaian RMI BUMN.');
  }
  saveCurrentAssessment(parsed);
  return parsed;
}
