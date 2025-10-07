
import React from 'react';
import ControlPanel from '../components/ControlPanel';
import DataChart from '../components/DataChart';
import NanoparticleSimulation from '../components/NanoparticleSimulation';
import { usePseudoRuleEngine } from '../hooks/usePseudoRuleEngine';
import { BeakerIcon } from '../components/icons';

const NanomaterialsSynthesis: React.FC = () => {
  const { parameters, result, isLoading, updateParameters } = usePseudoRuleEngine({
    concentration: 0.5,
    temperature: 25,
  });

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex-shrink-0">
        <h2 className="text-3xl font-bold text-gray-900">奈米材料合成</h2>
        <p className="text-gray-500 mt-1">
          透過調整反應條件，模擬金奈米粒子的合成過程。
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex-1 min-h-[300px] flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <BeakerIcon className="h-6 w-6 mr-2 text-cyan-500"/>
                  反應容器
              </h3>
              <div className="flex-1">
                <NanoparticleSimulation result={result} isLoading={isLoading} />
              </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <DataChart data={result.spectrum} title="紫外-可見光吸收光譜" />
          </div>
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-8">
            <ControlPanel
                parameters={parameters}
                onParameterChange={updateParameters}
                isLoading={isLoading}
            />
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">觀測結果</h3>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">粒子大小</span>
                        <span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{result.particleSize.toFixed(1)} nm</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">溶液顏色</span>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: result.solutionColor }}></div>
                          <span className="capitalize font-medium">{result.color.split('-')[0]}</span>
                        </div>
                    </li>
                </ul>
                <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
                  註：由於表面電漿共振效應，粒子大小的改變會導致溶液顏色與紫外-可見光吸收光譜的變化。
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NanomaterialsSynthesis;