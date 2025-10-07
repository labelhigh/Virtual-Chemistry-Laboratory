import React, { useState, useMemo } from 'react';
import { SPECTROSCOPY_DATA } from '../data/experimentData';
import type { UnknownSample } from '../types';
import NMRChart from '../components/NMRChart';
import MSChart from '../components/MSChart';
// FIX: Import BeakerIcon to resolve reference error.
import { WaveformIcon, MoleculeIcon, SettingsIcon, BeakerIcon } from '../components/icons';

type Instrument = 'NMR' | 'MS';

const SpectroscopyAnalysis: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<UnknownSample>(SPECTROSCOPY_DATA['sample-a']);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>('NMR');

  const samples = useMemo(() => Object.values(SPECTROSCOPY_DATA), []);

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">光譜分析</h2>
        <p className="text-gray-500 mt-1">
          分析未知樣品的 ¹H NMR 與質譜 (MS) 圖譜以鑑定其化學結構。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <BeakerIcon className="h-6 w-6 mr-2 text-cyan-500" />
              樣品選擇
            </h3>
            <div className="flex flex-col space-y-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setSelectedSample(sample)}
                  className={`px-4 py-2 rounded-md text-left font-medium transition-colors duration-200 ${
                    selectedSample.id === sample.id
                      ? 'bg-cyan-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sample.displayName}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <SettingsIcon className="h-6 w-6 mr-2 text-cyan-500" />
                儀器選擇
            </h3>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button 
                    onClick={() => setSelectedInstrument('NMR')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${selectedInstrument === 'NMR' ? 'bg-white text-cyan-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                    ¹H NMR
                </button>
                <button 
                    onClick={() => setSelectedInstrument('MS')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${selectedInstrument === 'MS' ? 'bg-white text-cyan-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                    質譜 (MS)
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <MoleculeIcon className="h-6 w-6 mr-2 text-cyan-500" />
              結構解析結果
            </h3>
            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">化合物名稱</span>
                    <span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{selectedSample.name}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">化學式</span>
                    <span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{selectedSample.formula}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 min-h-[500px]">
          {selectedInstrument === 'NMR' ? (
            <NMRChart data={selectedSample.nmrData} title="¹H 核磁共振光譜 (¹H NMR)" />
          ) : (
            <MSChart data={selectedSample.msData} title="質譜 (Mass Spectrometry)" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpectroscopyAnalysis;
