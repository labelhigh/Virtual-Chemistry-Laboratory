import React, { useRef, useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Tooltip, ReferenceLine, Line } from 'recharts';
import * as d3 from 'd3';
import type { CVDataPoint } from '../types';

interface CVChartProps {
  data: CVDataPoint[];
  title: string;
}

// A self-contained component to render the animated SVG path.
// It receives `points` from the Recharts <Line> component.
const AnimatedPath = ({ points }: { points?: { x: number; y: number }[] }) => {
  const pathRef = useRef<SVGPathElement>(null);
  // We use a state to hold the path length, which is crucial for the animation.
  // A key is added to the path to force re-mounting and re-triggering the animation when data changes.
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      // When the path is rendered, get its total length.
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [points]); // Re-calculate when the points change.

  if (!points || points.length === 0) return null;

  // d3.line() is a helper to generate the SVG path data string from points.
  const pathData = d3.line<{ x: number; y: number }>()
    .x(p => p.x)
    .y(p => p.y)(points);

  return (
    <path
      ref={pathRef}
      d={pathData || ''}
      fill="none"
      stroke="#06b6d4"
      strokeWidth="2.5"
      // The animation works by setting the dash array and offset to the path's full length...
      strokeDasharray={pathLength}
      strokeDashoffset={pathLength}
      // ...and then animating the offset to 0 with CSS.
      style={{ animation: 'dash 1.5s ease-out forwards' }}
    />
  );
};

const CVChart: React.FC<CVChartProps> = ({ data, title }) => {
  const xDomain = [-0.3, 0.8];
  // Calculate y-domain with a bit of padding.
  const yDomain = data.length > 0 
    ? [Math.min(-1, d3.min(data, d => d.current)!) - 2, Math.max(1, d3.max(data, d => d.current)!) + 2] 
    : [-5, 5];
  
  // A unique key for the chart component based on data helps ensure animations restart correctly on data change.
  const chartKey = data.length > 0 ? data[0].voltage + data[data.length - 1].current : 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full w-full flex flex-col">
       <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            key={chartKey} // Use key to force re-render
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="voltage"
              type="number"
              domain={xDomain}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '電位 (V vs Ref)', position: 'insideBottom', offset: -15, fill: '#374151' }}
            />
            <YAxis
              dataKey="current"
              stroke="#6b7280"
              allowDataOverflow={true}
              domain={yDomain}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '電流 (μA)', angle: -90, position: 'insideLeft', fill: '#374151', dx: -10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number) => [`${value.toFixed(2)} µA`, 'Current']}
              labelFormatter={(label) => `Voltage: ${Number(label).toFixed(3)} V`}
            />
            <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} strokeDasharray="2 2" />
            
            {/* 
              This is the correct way to render a custom line in Recharts.
              1. Use a standard <Line> component.
              2. Set its stroke to 'none' to hide the default line.
              3. Pass a custom component to the `content` prop. Recharts will pass `points` to it.
            */}
            <Line 
              type="monotone"
              dataKey="current" 
              stroke="none"
              dot={false}
              isAnimationActive={false}
              content={<AnimatedPath />} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CVChart;
