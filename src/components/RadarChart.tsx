import React from 'react';
import { DimensionSummary } from '../types/rmi';
import { motion } from 'framer-motion';

interface RadarChartProps {
  dimensions: DimensionSummary[];
  targetScore?: number;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  targetScore = 4.0,
  size = 310
}) => {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const numDimensions = dimensions.length;

  if (numDimensions === 0) return null;

  const getPoint = (index: number, value: number, maxVal = 5) => {
    const angle = (index * 2 * Math.PI) / numDimensions - Math.PI / 2;
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [1, 2, 3, 4, 5];

  const actualPoints = dimensions
    .map((d, i) => {
      const pt = getPoint(i, Math.max(0, Math.min(5, d.score)));
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const targetPoints = dimensions
    .map((_, i) => {
      const pt = getPoint(i, targetScore);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarFillPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#AB68FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6531F7" stopOpacity="0.18" />
          </linearGradient>
          <filter id="glowNode" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6531F7" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Concentric Grid Pentagons */}
        {gridLevels.map(level => {
          const levelPoints = dimensions
            .map((_, i) => {
              const pt = getPoint(i, level);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');
          return (
            <g key={`grid-${level}`}>
              <polygon
                points={levelPoints}
                fill={level % 2 === 0 ? 'rgba(248, 250, 253, 0.75)' : 'rgba(255, 255, 255, 0.95)'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text
                x={center + 5}
                y={center - (level / 5) * radius + 4}
                fontSize="9"
                fill="#94A3B8"
                fontWeight="600"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axes lines */}
        {dimensions.map((_, i) => {
          const outer = getPoint(i, 5);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#E2E8F0"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          );
        })}

        {/* Target Polygon (Subtle Slate Dashed) */}
        <polygon
          points={targetPoints}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />

        {/* Actual Score Polygon (Animated Smooth Scale & Radiant Fill) */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          points={actualPoints}
          fill="url(#radarFillPurple)"
          stroke="#6531F7"
          strokeWidth="2.5"
        />

        {/* Data points (Purple Dots with Smooth Spring Pop) */}
        {dimensions.map((d, i) => {
          const pt = getPoint(i, Math.max(0, Math.min(5, d.score)));
          return (
            <motion.g
              key={`dot-${i}`}
              filter="url(#glowNode)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08 + i * 0.04, type: 'spring', stiffness: 320, damping: 24 }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5.5"
                fill="#6531F7"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </motion.g>
          );
        })}

        {/* Dimension Labels */}
        {dimensions.map((d, i) => {
          const outerPt = getPoint(i, 5.4);
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (outerPt.x > center + 15) textAnchor = 'start';
          if (outerPt.x < center - 15) textAnchor = 'end';

          return (
            <g key={`label-${i}`} transform={`translate(${outerPt.x}, ${outerPt.y})`}>
              <text
                textAnchor={textAnchor}
                fontSize="11"
                fontWeight="700"
                fill="#0F172A"
                className="font-sans"
              >
                D{d.dimNum}: {d.score.toFixed(2)}
              </text>
              <text
                textAnchor={textAnchor}
                y="12"
                fontSize="9"
                fill="#64748B"
                className="font-sans"
              >
                {d.dimName.length > 22 ? d.dimName.slice(0, 20) + '…' : d.dimName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Modern Legend Pill */}
      <div className="flex items-center gap-4 mt-2 text-xs px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#6531F7] shadow-[0_0_6px_rgba(101,49,247,0.4)]"></span>
          <span className="text-slate-700">Skor Aktual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400"></span>
          <span className="text-slate-500">Target ({targetScore.toFixed(1)})</span>
        </div>
      </div>
    </div>
  );
};
