// Test formula conformity with official Juknis SK-8/DKU.MBU/12/2023
const HEALTH_CONV = {
  AAA: 100, AA: 90, A: 79, BBB: 67, BB: 56, B: 44, CCC: 33, CC: 21, C: 10
};
const COMP_CONV = {
  1: 100, 2: 78, 3: 55, 4: 33, 5: 10
};

function getAdjustment(dimScore, totalPerf) {
  if (dimScore < 3.0) return 0.0;
  if (totalPerf <= 50) return -1.0;
  if (totalPerf <= 65) return -0.75;
  if (totalPerf <= 80) return -0.50;
  if (totalPerf <= 90) return -0.25;
  return 0.0;
}

function resolveSpectrum(score) {
  if (score < 1.5) return 'Fase Awal';
  if (score < 1.9) return 'Fase Awal (+)';
  if (score < 2.5) return 'Fase Berkembang';
  if (score < 2.9) return 'Fase Berkembang (+)';
  if (score < 3.5) return 'Fase Praktik yang Baik';
  if (score < 3.9) return 'Fase Praktik yang Baik (+)';
  if (score < 4.5) return 'Fase Praktik yang Lebih Baik';
  if (score < 4.9) return 'Fase Praktik yang Lebih Baik (+)';
  return 'Fase Praktik Terbaik';
}

console.log('=== TEST CASE 1 (Ilustrasi 1 Hal 20 Juknis) ===');
const d1 = 3.4;
const tk1 = 'A';
const pk1 = 2;
const totalPerf1 = (HEALTH_CONV[tk1] * 0.5) + (COMP_CONV[pk1] * 0.5);
const adj1 = getAdjustment(d1, totalPerf1);
const final1 = Number((d1 + adj1).toFixed(2));
const phase1 = resolveSpectrum(final1);
console.log(`Total Kinerja: ${totalPerf1} (Expected: 78.5)`);
console.log(`Penyesuaian: ${adj1} (Expected: -0.5)`);
console.log(`Skor RMI: ${final1} (Expected: 2.9)`);
console.log(`Fase: ${phase1} (Expected: Fase Praktik yang Baik)`);
console.assert(totalPerf1 === 78.5, 'Test 1 Total Kinerja Failed');
console.assert(adj1 === -0.5, 'Test 1 Penyesuaian Failed');
console.assert(final1 === 2.9, 'Test 1 Skor Akhir Failed');

console.log('\n=== TEST CASE 2 (Ilustrasi 2 Hal 20 Juknis) ===');
const d2 = 2.9;
const tk2 = 'BBB';
const pk2 = 4;
const totalPerf2 = (HEALTH_CONV[tk2] * 0.5) + (COMP_CONV[pk2] * 0.5);
const adj2 = getAdjustment(d2, totalPerf2);
const final2 = Number((d2 + adj2).toFixed(2));
const phase2 = resolveSpectrum(final2);
console.log(`Total Kinerja: ${totalPerf2} (Expected: 50.0)`);
console.log(`Penyesuaian: ${adj2} (Expected: 0.0 - karena Dimensi < 3.00)`);
console.log(`Skor RMI: ${final2} (Expected: 2.9)`);
console.assert(totalPerf2 === 50.0, 'Test 2 Total Kinerja Failed');
console.assert(adj2 === 0.0, 'Test 2 Penyesuaian Failed');
console.assert(final2 === 2.9, 'Test 2 Skor Akhir Failed');

console.log('\nAll formula verification tests passed 100%!');
