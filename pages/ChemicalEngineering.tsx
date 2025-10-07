
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DistillationParameters, DistillationResult, TrayComposition } from '../types';
import { SettingsIcon, LayersIcon, ChartIcon } from '../components/icons';

const calculateDistillation = (params: DistillationParameters): DistillationResult => {
  const { refluxRatio, trayCount } = params;
  const feedConcentration = 0.50; // 50% ethanol
  
  const alpha = 2.5; // Relative volatility (simplified)
  let compositions: TrayComposition[] = [];
  
  let x = 0.1; // Bottoms concentration starting point
  let y;

  for (let i = 1; i <= trayCount; i++) {
    y = (alpha * x) / (1 + x * (alpha - 1));
    x = y / (1 + (refluxRatio / 2));
    compositions.push({ trayNumber: i, ethanolConcentration: x * 100 });
  }

  const distillateConcentration = Math.min(95.6, (y || 0) * (1 + refluxRatio * 0.1) * 100);
  const bottomsConcentration = compositions[0]?.ethanolConcentration / (1 + refluxRatio * 0.05) || 0;
  
  return { distillateConcentration, bottomsConcentration, compositions };
};


const ChemicalEngineering: React.FC = () => {
    const [parameters, setParameters] = useState<DistillationParameters>({ refluxRatio: 2.5, trayCount: 10 });
    const [result, setResult] = useState<DistillationResult>({ distillateConcentration: 0, bottomsConcentration: 0, compositions: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setResult(calculateDistillation(parameters));
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [parameters]);

    const updateParameters = (newParams: Partial<DistillationParameters>) => {
        setParameters(prev => ({ ...prev, ...newParams }));
    };

    return (
    <div className="flex flex-col h-full gap-8">
       <style>{`
        @keyframes bubble-rise {
          0% { transform: translateY(0); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translateY(-300px); opacity: 0; }
        }
        .bubble {
            animation: bubble-rise 4s linear infinite;
        }
        @keyframes flow-down {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(10px); opacity: 1; }
        }
        .flow-arrow {
            animation: flow-down 1.5s ease-out infinite;
        }
      `}</style>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">化工製程模擬：分餾塔</h2>
        <p className="text-gray-500 mt-1">
          設定塔板數與迴流比，目標是從乙醇-水混合物中得到高純度的乙醇。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg-col-span-1 flex flex-col gap-8">
            <div className={`bg-white p-6 rounded-xl shadow-md ${isLoading ? 'opacity-70 animate-pulse' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center"><SettingsIcon className="h-6 w-6 mr-2 text-cyan-500" />控制面板</h3>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="refluxRatio" className="block text-sm font-medium text-gray-600 mb-2">迴流比 ({parameters.refluxRatio.toFixed(1)})</label>
                        <input id="refluxRatio" type="range" min="1.0" max="10.0" step="0.1" value={parameters.refluxRatio} onChange={(e) => updateParameters({ refluxRatio: parseFloat(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"/>
                    </div>
                    <div>
                        <label htmlFor="trayCount" className="block text-sm font-medium text-gray-600 mb-2">理論塔板數 ({parameters.trayCount})</label>
                        <input id="trayCount" type="range" min="3" max="30" step="1" value={parameters.trayCount} onChange={(e) => updateParameters({ trayCount: parseInt(e.target.value, 10) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"/>
                    </div>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><LayersIcon className="h-6 w-6 mr-2 text-cyan-500" />分離結果</h3>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">塔頂餾出物濃度</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.distillateConcentration.toFixed(1)} %</span></li>
                    <li className="flex items-center justify-between"><span className="font-medium text-gray-600">塔底流出物濃度</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.bottomsConcentration.toFixed(1)} %</span></li>
                </ul>
            </div>
        </div>

        <div className="lg:col-span-2 min-h-[500px] flex flex-col gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center justify-around relative">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 absolute top-4 left-4">分餾塔示意圖</h3>
            <div className="w-32 h-[90%] bg-gray-200 rounded-lg flex flex-col-reverse justify-between items-center relative overflow-hidden shadow-inner">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-300 to-orange-400 transition-all duration-500" style={{opacity: 0.8, filter: `hue-rotate(${parameters.refluxRatio * 5}deg)`}}></div>
                
                {/* Bubbles */}
                <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bubble absolute bottom-0 rounded-full bg-white/50" style={{
                            left: `${10 + Math.random() * 80}%`,
                            width: `${3 + Math.random() * 4}px`,
                            height: `${3 + Math.random() * 4}px`,
                            animationDelay: `${Math.random() * 4}s`
                        }} />
                    ))}
                </div>
                
                {/* Trays */}
                {Array.from({ length: parameters.trayCount }).map((_, i) => (
                    <div key={i} className="w-full h-px bg-gray-500/50"></div>
                ))}

                <div className="absolute top-0 left-0 w-full p-2 text-center text-xs font-bold text-white bg-black/30">塔頂 (Distillate)</div>
                <div className="absolute bottom-0 left-0 w-full p-2 text-center text-xs font-bold text-white bg-black/30">塔底 (Bottoms)</div>
            </div>
            <div className="w-2/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.compositions} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="trayNumber" label={{ value: '塔板編號 (由下往上)', position: 'insideBottom', offset: -10 }} />
                        <YAxis domain={[0, 100]} label={{ value: '乙醇濃度 (%)', angle: -90, position: 'insideLeft' }}/>
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="ethanolConcentration" name="乙醇濃度" stroke="#0891b2" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default ChemicalEngineering;
