

import React, { useState, useMemo } from 'react';
import { QUANTUM_CHEMISTRY_DATA } from '../data/experimentData';
import type { QuantumMolecule } from '../types';
import MoleculeViewer from '../components/MoleculeViewer';
// FIX: Import `ChartIcon` to resolve reference error.
import { MoleculeIcon, SettingsIcon, CubeIcon, ChartIcon } from '../components/icons';

type OrbitalType = 'HOMO' | 'LUMO';

const QuantumChemistry: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState<QuantumMolecule>(QUANTUM_CHEMISTRY_DATA['ethylene']);
  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalType>('HOMO');

  const molecules = useMemo(() => Object.values(QUANTUM_CHEMISTRY_DATA), []);
  const orbitalData = selectedOrbital === 'HOMO' ? selectedMolecule.homo : selectedMolecule.lumo;

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">量子化學實驗</h2>
        <p className="text-gray-500 mt-1">
          視覺化呈現分子的最高佔據分子軌域 (HOMO) 與最低未佔據分子軌域 (LUMO)。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-2 min-h-[500px] flex flex-col">
           <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                <CubeIcon className="h-6 w-6 mr-2 text-cyan-500"/>
                3D 互動模型 (可拖曳旋轉)
            </h3>
            <div className="flex-1">
                <MoleculeViewer molecule={selectedMolecule} orbital={orbitalData} />
            </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <MoleculeIcon className="h-6 w-6 mr-2 text-cyan-500" />
              分子選擇
            </h3>
            <div className="flex flex-col space-y-2">
              {molecules.map((mol) => (
                <button
                  key={mol.id}
                  onClick={() => setSelectedMolecule(mol)}
                  className={`px-4 py-2 rounded-md text-left font-medium transition-colors duration-200 ${
                    selectedMolecule.id === mol.id
                      ? 'bg-cyan-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mol.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <SettingsIcon className="h-6 w-6 mr-2 text-cyan-500" />
                軌域選擇
            </h3>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button 
                    onClick={() => setSelectedOrbital('HOMO')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${selectedOrbital === 'HOMO' ? 'bg-white text-cyan-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                    HOMO
                </button>
                <button 
                    onClick={() => setSelectedOrbital('LUMO')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${selectedOrbital === 'LUMO' ? 'bg-white text-cyan-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                    LUMO
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <ChartIcon className="h-6 w-6 mr-2 text-cyan-500" />
              軌域資訊
            </h3>
            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">軌域類型</span>
                    <span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{selectedOrbital}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">軌域能量</span>
                    <span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{orbitalData.energy.toFixed(2)} eV</span>
                </div>
            </div>
             <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
                註：HOMO/LUMO 的能量差 (能隙) 是分子反應性與光學性質的重要指標。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuantumChemistry;