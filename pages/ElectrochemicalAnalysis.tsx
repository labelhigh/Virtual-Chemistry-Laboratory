
import React, { useState, useEffect } from 'react';
import type { CVParameters, CVResult, CVDataPoint } from '../types';
import { SettingsIcon, WaveformIcon, ChartIcon } from '../components/icons';
import CVChart from '../components/CVChart';

// Simplified Randles-Sevcik equation simulation
const calculateCVData = (params: CVParameters): CVResult => {
  const { scanRate, concentration } = params;
  const data: CVDataPoint[] = [];
  const E0 = 0.25; // Standard potential
  const alpha = 0.5; // Transfer coefficient
  const n = 1; // Number of electrons
  const F = 96485, R = 8.314, T = 298.15;
  const k0 = 1e-2; // Standard rate constant
  
  const E_start = -0.2, E_switch = 0.7;
  const dt = 0.001; // time step
  let E = E_start;
  let t = 0;
  
  // Forward scan
  while (E < E_switch) {
    const kf = k0 * Math.exp(-alpha * n * F * (E - E0) / (R * T));
    const kb = k0 * Math.exp((1 - alpha) * n * F * (E - E0) / (R * T));
    const current = (n * F * concentration * (kf - kb)) / (1 + Math.exp(n * F * (E - E0) / (R * T))) * Math.sqrt(scanRate);
    data.push({ voltage: E, current: current * 5e5 + (Math.random() - 0.5) * 0.1 });
    E += scanRate * dt;
    t += dt;
  }
  
  // Reverse scan
  while (E > E_start) {
    const kf = k0 * Math.exp(-alpha * n * F * (E - E0) / (R * T));
    const kb = k0 * Math.exp((1 - alpha) * n * F * (E - E0) / (R * T));
    const current = (n * F * concentration * (kf - kb)) / (1 + Math.exp(n * F * (E - E0) / (R * T))) * Math.sqrt(scanRate);
    data.push({ voltage: E, current: current * 5e5 + (Math.random() - 0.5) * 0.1 });
    E -= scanRate * dt;
    t += dt;
  }
  
  let ipa = -Infinity, ipc = Infinity, epa = null, epc = null;
  data.forEach(p => {
    if (p.current > ipa) { ipa = p.current; epa = p.voltage; }
    if (p.current < ipc) { ipc = p.current; epc = p.voltage; }
  });

  return { data, ipa, ipc: Math.abs(ipc), epa, epc };
};

const ElectrochemicalAnalysis: React.FC = () => {
  const [parameters, setParameters] = useState<CVParameters>({ scanRate: 0.1, concentration: 5 });
  const [result, setResult] = useState<CVResult>({ data: [], ipa: null, ipc: null, epa: null, epc: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setResult(calculateCVData(parameters));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [parameters]);
  
  const updateParameters = (newParams: Partial<CVParameters>) => {
    setParameters(prev => ({...prev, ...newParams}));
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">電化學分析：循環伏安法</h2>
        <p className="text-gray-500 mt-1">
          改變掃描速率與物質濃度，觀察循環伏安圖 (CV) 的變化。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-2 min-h-[500px]">
          <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <CVChart data={result.data} title="循環伏安圖" />
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
            <div className={`bg-white p-6 rounded-xl shadow-md ${isLoading ? 'opacity-70 animate-pulse' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                    <SettingsIcon className="h-6 w-6 mr-2 text-cyan-500" />
                    控制面板
                </h3>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="scanRate" className="block text-sm font-medium text-gray-600 mb-2">
                            掃描速率 ({parameters.scanRate.toFixed(2)} V/s)
                        </label>
                        <input
                            id="scanRate" type="range" min="0.01" max="0.5" step="0.01" value={parameters.scanRate}
                            onChange={(e) => updateParameters({ scanRate: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="concentration" className="block text-sm font-medium text-gray-600 mb-2">
                            電活性物質濃度 ({parameters.concentration.toFixed(1)} mM)
                        </label>
                        <input
                            id="concentration" type="range" min="1" max="20" step="0.5" value={parameters.concentration}
                            onChange={(e) => updateParameters({ concentration: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <ChartIcon className="h-6 w-6 mr-2 text-cyan-500" />
                    數據分析
                </h3>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">陽極峰值電位 (Epa)</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.epa?.toFixed(3) ?? 'N/A'} V</span></li>
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">陰極峰值電位 (Epc)</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.epc?.toFixed(3) ?? 'N/A'} V</span></li>
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">陽極峰值電流 (ipa)</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.ipa?.toFixed(2) ?? 'N/A'} µA</span></li>
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">陰極峰值電流 (ipc)</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.ipc?.toFixed(2) ?? 'N/A'} µA</span></li>
                </ul>
                <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
                  註：根據 Randles-Sevcik 方程式，峰值電流與掃描速率的平方根成正比。
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ElectrochemicalAnalysis;
