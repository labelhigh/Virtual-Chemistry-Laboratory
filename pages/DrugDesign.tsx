
import React, { useState, useEffect } from 'react';
import type { Ligand, DockingResult } from '../types';
import { TargetIcon, MoleculeIcon, CheckCircleIcon, SparklesIcon } from '../components/icons';

const LIGAND_LIBRARY: Ligand[] = [
  { id: 'lig-1', name: '候選藥物 A', formula: 'C₁₀H₁₂N₂O', dockingScore: -8.5 },
  { id: 'lig-2', name: '候選藥物 B', formula: 'C₁₂H₁₅NO₂S', dockingScore: -7.2 },
  { id: 'lig-3', name: '候選藥物 C', formula: 'C₉H₈O₄', dockingScore: -9.8 },
  { id: 'lig-4', name: '候選藥物 D', formula: 'C₁₇H₁₉NO₃', dockingScore: -6.1 },
  { id: 'lig-5', name: '候選藥物 E', formula: 'C₂₁H₃₀O₂', dockingScore: -10.3 },
];

const DockingAnimation: React.FC<{ isRunning: boolean, isDocked: boolean }> = ({ isRunning, isDocked }) => {
    return (
        <div className="w-64 h-64 relative">
             <style>{`
                @keyframes ligand-fly-in {
                    0% { transform: translate(-150px, -150px) scale(0.5); opacity: 0; }
                    70% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(0, 0) scale(1); opacity: 1; }
                }
                .ligand-animate { animation: ligand-fly-in 1.5s ease-out forwards; }
                
                @keyframes protein-glow {
                    0%, 100% { filter: drop-shadow(0 0 5px #06b6d4); }
                    50% { filter: drop-shadow(0 0 15px #06b6d4); }
                }
                .protein-glow-animate { animation: protein-glow 2s ease-in-out infinite; }

                @keyframes docked-flash {
                     from { stroke: #06b6d4; }
                     to { stroke: #10b981; }
                }
                .docked-flash-animate { animation: docked-flash 0.5s ease-in-out alternate 2; }
            `}</style>
            {/* Protein Target */}
            <svg viewBox="0 0 100 100" className="absolute inset-0">
                <path 
                    d="M50 10 C 80 10, 90 40, 90 50 S 80 90, 50 90 S 10 80, 10 50 S 20 10, 50 10" 
                    fill="none" 
                    stroke="#e0f2fe" 
                    strokeWidth="4" 
                    className={!isRunning && !isDocked ? "protein-glow-animate" : ""}
                />
                 <path d="M40 40 C 45 45, 55 45, 60 40" stroke="#bae6fd" strokeWidth="3" fill="none" />
            </svg>
            
            {/* Ligand */}
            {isRunning && (
                <svg viewBox="-25 -25 50 50" className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 ligand-animate">
                    <circle cx="0" cy="0" r="8" fill="#a5f3fc"/>
                    <circle cx="-15" cy="-5" r="5" fill="#67e8f9"/>
                    <line x1="0" y1="0" x2="-15" y2="-5" stroke="#0891b2" strokeWidth="2"/>
                </svg>
            )}

            {isDocked && (
                <svg viewBox="0 0 100 100" className="absolute inset-0">
                    <path 
                    d="M50 10 C 80 10, 90 40, 90 50 S 80 90, 50 90 S 10 80, 10 50 S 20 10, 50 10" 
                    fill="#e0f2fe"
                    stroke="#10b981" 
                    strokeWidth="4" 
                    className="docked-flash-animate"
                    />
                    <circle cx="50" cy="50" r="4" fill="#10b981" />
                </svg>
            )}

            {!isRunning && !isDocked && (
                 <TargetIcon className="w-32 h-32 text-cyan-500 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            )}
        </div>
    );
}

const DrugDesign: React.FC = () => {
    const [dockedResults, setDockedResults] = useState<DockingResult[]>([]);
    const [runningLigandId, setRunningLigandId] = useState<string | null>(null);
    const [lastDockedId, setLastDockedId] = useState<string | null>(null);

    const handleDockLigand = (ligand: Ligand) => {
        if (dockedResults.some(r => r.id === ligand.id) || runningLigandId) return;

        setRunningLigandId(ligand.id);
        setLastDockedId(null);
        setTimeout(() => {
            setDockedResults(prev => [...prev, { ...ligand, status: 'docked' }].sort((a,b) => a.dockingScore - b.dockingScore));
            setRunningLigandId(null);
            setLastDockedId(ligand.id);
        }, 1500);
    };

    const resetSimulation = () => {
        setDockedResults([]);
        setRunningLigandId(null);
        setLastDockedId(null);
    };

    return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">藥物設計與篩選</h2>
        <p className="text-gray-500 mt-1">
          從虛擬化合物庫中選擇分子，進行分子對接模擬，找出與蛋白質靶點結合最好的候選藥物。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><MoleculeIcon className="h-6 w-6 mr-2 text-cyan-500" />化合物庫</h3>
                <div className="space-y-2">
                    {LIGAND_LIBRARY.map(ligand => {
                        const isDocked = dockedResults.some(r => r.id === ligand.id);
                        const isRunning = runningLigandId === ligand.id;
                        return (
                            <button
                                key={ligand.id}
                                onClick={() => handleDockLigand(ligand)}
                                disabled={isDocked || !!runningLigandId}
                                className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center transition-all duration-200 ${
                                    isDocked ? 'bg-green-100 text-green-800 cursor-not-allowed' :
                                    isRunning ? 'bg-cyan-100 text-cyan-800 cursor-wait animate-pulse' :
                                    'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="font-medium">{ligand.name} <span className="text-sm text-gray-500">{ligand.formula}</span></span>
                                {isDocked && <CheckCircleIcon className="h-5 w-5 text-green-600"/>}
                            </button>
                        )
                    })}
                </div>
                 <button onClick={resetSimulation} className="w-full mt-4 text-sm text-cyan-600 hover:text-cyan-800">重設模擬</button>
            </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8 min-h-[500px]">
            <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex flex-col items-center justify-center">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 self-start flex items-center"><TargetIcon className="h-6 w-6 mr-2 text-cyan-500"/>對接模擬區</h3>
                 <div className="flex-grow flex items-center justify-center">
                    <DockingAnimation isRunning={!!runningLigandId} isDocked={!!lastDockedId} />
                 </div>
                 <p className="text-gray-600 h-6 text-center">
                    {runningLigandId ? `正在對接 ${LIGAND_LIBRARY.find(l=>l.id===runningLigandId)?.name}...` 
                    : lastDockedId ? `${LIGAND_LIBRARY.find(l=>l.id===lastDockedId)?.name} 對接成功！`
                    : "請從左側選擇一個化合物進行對接"}
                 </p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">對接結果 (分數越低越好)</h3>
                 {dockedResults.length > 0 ? (
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 font-semibold">排名</th>
                                <th className="p-2 font-semibold">候選藥物</th>
                                <th className="p-2 font-semibold">結合能量分數 (kcal/mol)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dockedResults.map((result, index) => (
                                <tr key={result.id} className={`border-b border-gray-100 transition-colors ${index === 0 ? 'bg-cyan-50' : ''} ${lastDockedId === result.id ? 'animate-pulse-light' : ''}`}>
                                    <td className="p-2 font-bold text-cyan-600">{index + 1}</td>
                                    <td className="p-2">{result.name}</td>
                                    <td className="p-2 font-mono">{result.dockingScore.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <p className="text-center text-gray-500 py-4">結果將顯示於此。</p>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DrugDesign;
