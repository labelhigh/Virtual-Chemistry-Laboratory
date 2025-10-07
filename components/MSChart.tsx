
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MSFragment } from '../types';

interface MSChartProps {
  data: MSFragment[];
  title: string;
}

const MSChart: React.FC<MSChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full w-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="mz"
              type="number"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '質荷比 (m/z)', position: 'insideBottom', offset: -15, fill: '#374151' }}
            />
            <YAxis
              domain={[0, 110]}
              stroke="#6b7280"
              tickFormatter={(tick) => `${tick}%`}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '相對強度', angle: -90, position: 'insideLeft', fill: '#374151', dx: -5 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.5rem',
              }}
               formatter={(value: number) => [`${value.toFixed(1)}%`, '相對強度']}
               labelFormatter={(label) => `m/z: ${label}`}
            />
            <Bar dataKey="intensity" fill="#0891b2" maxBarSize={20}>
                {/* This is Recharts' built-in way to animate bars one by one */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MSChart;
