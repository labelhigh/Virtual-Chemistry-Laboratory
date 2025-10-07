
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SpectrumPoint } from '../types';

interface DataChartProps {
  data: SpectrumPoint[];
  title: string;
}

const DataChart: React.FC<DataChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full w-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="wavelength" 
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '波長 (nm)', position: 'insideBottom', offset: -15, fill: '#374151' }} 
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: '吸收度', angle: -90, position: 'insideLeft', fill: '#374151', dx: -10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                color: '#374151',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Legend wrapperStyle={{ color: '#374151', paddingTop: '20px' }}/>
            <Line type="monotone" dataKey="absorbance" name="吸收度" stroke="#06b6d4" strokeWidth={2.5} dot={false} activeDot={{ r: 6, strokeWidth: 2, fill: '#06b6d4' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataChart;