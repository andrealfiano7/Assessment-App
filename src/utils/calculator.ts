import {
  RmiParameter,
  ParameterAssessment,
  DimensionSummary,
  HealthRating,
  CompositeRating,
  MaturitySpectrum
} from '../types/rmi';
import {
  DIMENSIONS_META,
  HEALTH_RATING_CONVERSION,
  COMPOSITE_RATING_CONVERSION,
  MATURITY_SPECTRUM
} from '../data/rmiCommon';

export interface CalculationResult {
  dimensions: DimensionSummary[];
  dimensionAspectScore: number;
  totalParameters: number;
  totalAssessed: number;
  completionPercentage: number;
  
  // Performance
  healthConversion: number;
  healthWeighted: number;
  compositeConversion: number;
  compositeWeighted: number;
  totalPerformanceScore: number;
  
  // Adjustment
  isAdjustmentApplicable: boolean;
  scoreAdjustment: number;
  adjustmentReason: string;
  
  // Final Score & Maturity
  finalRmiScore: number;
  maturityPhase: MaturitySpectrum;
}

export function calculateRmi(
  parameters: RmiParameter[],
  assessments: Record<number, ParameterAssessment>,
  healthRating: HealthRating,
  compositeRating: CompositeRating
): CalculationResult {
  // 1. Calculate per Dimension
  const dimensionSummaries: DimensionSummary[] = DIMENSIONS_META.map(meta => {
    const dimParams = parameters.filter(p => p.dim_num === meta.dimNum);
    const assessedInDim = dimParams.filter(p => (assessments[p.id]?.score ?? 0) > 0);
    
    let sumScore = 0;
    assessedInDim.forEach(p => {
      sumScore += assessments[p.id].score;
    });

    const avgScore = assessedInDim.length > 0 ? sumScore / assessedInDim.length : 0;

    return {
      dimNum: meta.dimNum,
      dimName: meta.name,
      paramCount: dimParams.length,
      assessedCount: assessedInDim.length,
      score: Number(avgScore.toFixed(2))
    };
  });

  // 2. Calculate Dimension Aspect Score (Rata-rata dari seluruh parameter yang sudah dinilai)
  const allAssessed = parameters.filter(p => (assessments[p.id]?.score ?? 0) > 0);
  const totalScore = allAssessed.reduce((acc, p) => acc + assessments[p.id].score, 0);
  const dimensionAspectScore = allAssessed.length > 0 
    ? Number((totalScore / allAssessed.length).toFixed(2))
    : 0;

  const totalParameters = parameters.length;
  const totalAssessed = allAssessed.length;
  const completionPercentage = totalParameters > 0 ? Math.round((totalAssessed / totalParameters) * 100) : 0;

  // 3. Performance Aspect Calculations
  const healthConversion = HEALTH_RATING_CONVERSION[healthRating] ?? 0;
  const healthWeighted = Number((healthConversion * 0.5).toFixed(2));

  const compositeConversion = COMPOSITE_RATING_CONVERSION[compositeRating] ?? 0;
  const compositeWeighted = Number((compositeConversion * 0.5).toFixed(2));

  const totalPerformanceScore = Number((healthWeighted + compositeWeighted).toFixed(2));

  // 4. Score Adjustment Logic (Bab II & Tabel 4)
  // Aturan: Penyesuaian HANYA berlaku jika Skor Aspek Dimensi >= 3.00
  const isAdjustmentApplicable = dimensionAspectScore >= 3.00;
  let scoreAdjustment = 0;
  let adjustmentReason = '';

  if (!isAdjustmentApplicable) {
    scoreAdjustment = 0;
    adjustmentReason = 'Tidak dilakukan penyesuaian skor karena skor Aspek Dimensi Penilaian RMI yang diperoleh < 3,00.';
  } else {
    if (totalPerformanceScore <= 50) {
      scoreAdjustment = -1.00;
      adjustmentReason = 'Total skor Aspek Kinerja ≤ 50 (Penyesuaian -1,00)';
    } else if (totalPerformanceScore <= 65) {
      scoreAdjustment = -0.75;
      adjustmentReason = 'Total skor Aspek Kinerja 50 < x ≤ 65 (Penyesuaian -0,75)';
    } else if (totalPerformanceScore <= 80) {
      scoreAdjustment = -0.50;
      adjustmentReason = 'Total skor Aspek Kinerja 65 < x ≤ 80 (Penyesuaian -0,50)';
    } else if (totalPerformanceScore <= 90) {
      scoreAdjustment = -0.25;
      adjustmentReason = 'Total skor Aspek Kinerja 80 < x ≤ 90 (Penyesuaian -0,25)';
    } else {
      scoreAdjustment = 0.00;
      adjustmentReason = 'Total skor Aspek Kinerja > 90 (Penyesuaian 0,00)';
    }
  }

  // 5. Final RMI Score (Skor Dimensi + Penyesuaian Skor)
  // Jaga agar nilai tetap di rentang 1.0 - 5.0
  const rawFinalScore = dimensionAspectScore + scoreAdjustment;
  const finalRmiScore = Number(Math.max(1.0, Math.min(5.0, rawFinalScore)).toFixed(2));

  // 6. Spectrum Resolution (9 Bands)
  const maturityPhase = resolveMaturitySpectrum(finalRmiScore);

  return {
    dimensions: dimensionSummaries,
    dimensionAspectScore,
    totalParameters,
    totalAssessed,
    completionPercentage,
    healthConversion,
    healthWeighted,
    compositeConversion,
    compositeWeighted,
    totalPerformanceScore,
    isAdjustmentApplicable,
    scoreAdjustment,
    adjustmentReason,
    finalRmiScore,
    maturityPhase
  };
}

export function resolveMaturitySpectrum(score: number): MaturitySpectrum {
  // Find matching band
  for (const spectrum of MATURITY_SPECTRUM) {
    if (score >= spectrum.minScore && score <= spectrum.maxScore) {
      return spectrum;
    }
  }
  // Fallback
  if (score < 1.0) return MATURITY_SPECTRUM[0];
  return MATURITY_SPECTRUM[MATURITY_SPECTRUM.length - 1];
}

export function computeRecommendationPriority(impact: 'Tinggi' | 'Rendah', ease: 'Mudah' | 'Sulit'): 1 | 2 | 3 {
  // Bab II:
  // Prioritas 1: dampak tinggi dan mudah diimplementasikan
  // Prioritas 2: dampak rendah dan mudah diimplementasikan ATAU dampak tinggi namun tidak mudah
  // Prioritas 3: dampak rendah dan tidak mudah
  if (impact === 'Tinggi' && ease === 'Mudah') return 1;
  if (impact === 'Rendah' && ease === 'Sulit') return 3;
  return 2;
}
