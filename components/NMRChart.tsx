
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NMRPeak } from '../types';

interface NMRChartProps {
  data: NMRPeak[];
  title: string;
}

const generatePeakShape = (center: number, height: number, width: number) => {
  const points = [];
  for (let x = center - width * 4; x <= center + width * 4; x += 0.005) {
    const lorentzian = (width * width) / (Math.pow(x - center, 2) + (width * width));
    points.push({ shift: x, intensity: height * lorentzian + (Math.random() * 0.5) });
  }
  return points;
};

const applyMultiplicity = (peak: NMRPeak) => {
  const J = 0.015;
  switch (peak.multiplicity) {
    case 's': return generatePeakShape(peak.shift, peak.integration * 20, 0.005);
    case 'd': return [ ...generatePeakShape(peak.shift - J / 2, peak.integration * 10, 0.005), ...generatePeakShape(peak.shift + J / 2, peak.integration * 10, 0.005) ];
    case 't': return [ ...generatePeakShape(peak.shift - J, peak.integration * 5, 0.005), ...generatePeakShape(peak.shift, peak.integration * 10, 0.005), ...generatePeakShape(peak.shift + J, peak.integration * 5, 0.005) ];
    case 'q': return [ ...generatePeakShape(peak.shift - 1.5 * J, peak.integration * 2.5, 0.005), ...generatePeakShape(peak.shift - 0.5 * J, peak.integration * 7.5, 0.005), ...generatePeakShape(peak.shift + 0.5 * J, peak.integration * 7.5, 0.005), ...generatePeakShape(peak.shift + 1.5 * J, peak.integration * 2.5, 0.005) ];
    default: return generatePeakShape(peak.shift, peak.integration * 20, 0.02);
  }
};

const NMRChart: React.FC<NMRChartProps> = ({ data, title }) => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  
  useEffect(() => {
    const fullData = data.flatMap(applyMultiplicity).sort((a, b) => b.shift - a.shift);
    const baseline = [{ shift: 10, intensity: 0 }, ...fullData, { shift: 0, intensity: 0 }];
    
    // Animate the drawing
    let frame = 0;
    const frameCount = 60; // 60 frames for animation
    const interval = setInterval(() => {
      frame++;
      const sliceEnd = Math.ceil(baseline.length * (frame / frameCount));
      setAnimatedData(baseline.slice(0, sliceEnd));
      if (frame >= frameCount) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full w-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={animatedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="shift"
              type="number"
              domain={[10, 0]}
              tickFormatter={(tick) => tick.toFixed(1)}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '化學位移 (ppm)', position: 'insideBottom', offset: -15, fill: '#374151' }}
            />
            <YAxis
              stroke="#6b7280"
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 'dataMax + 10']}
              label={{ value: '相對強度', angle: -90, position: 'insideLeft', fill: '#374151', dx: -5 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
              labelFormatter={(label) => `${parseFloat(label).toFixed(2)} ppm`}
              formatter={(value: number) => [value.toFixed(2), '強度']}
            />
            <Line type="basis" dataKey="intensity" stroke="#083344" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NMRChart;
