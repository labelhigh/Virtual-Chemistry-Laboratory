
import React, { useState, useMemo } from 'react';
import type { SynthesisStep } from '../types';
import { BeakerIcon, FireIcon, FilterIcon, CheckCircleIcon, SparklesIcon, FlaskIcon } from '../components/icons';

const initialSteps: SynthesisStep[] = [
  { id: 1, name: '準備反應物', description: '將 2.0g 水楊酸加入錐形瓶中。', status: 'active' },
  { id: 2, name: '加入催化劑', description: '小心地加入 5.0mL 醋酸酐和 5 滴濃硫酸。', status: 'pending' },
  { id: 3, name: '水浴加熱', description: '將錐形瓶置於 70-80°C 的熱水浴中加熱 10 分鐘。', status: 'pending' },
  { id: 4, name: '水解與冷卻', description: '加入 2mL 蒸餾水分解剩餘的醋酸酐，然後在冰浴中冷卻。', status: 'pending' },
  { id: 5, name: '誘導結晶', description: '若無晶體析出，用玻璃棒刮擦錐形瓶內壁以誘導結晶。', status: 'pending' },
  { id: 6, name: '過濾與洗滌', description: '使用布氏漏斗進行減壓過濾，並用少量冰水洗滌晶體。', status: 'pending' },
  { id: 7, name: '乾燥與秤重', description: '將粗產物乾燥後秤重，計算產率。', status: 'pending' },
];

const AspirinSynthesisAnimation: React.FC<{ step: number }> = ({ step }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md h-full w-full p-6 border relative overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Flask */}
                <path d="M70 170 L70 110 Q 50 90, 60 70 L 80 30 H 120 L 140 70 Q 150 90, 130 110 L 130 170 Z" stroke="#4b5563" strokeWidth="3" fill="#e5e7eb" />

                {/* Step 1: Solid Reactant */}
                <g className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <path d="M80 168 C 90 155, 110 155, 120 168 L 130 170 L 70 170 Z" fill="#ffffff" />
                </g>

                {/* Step 2: Liquid Added */}
                <g className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                     <path d="M80 150 C 90 140, 110 140, 120 150 L 130 170 L 70 170 Z" fill="#a5f3fc" />
                </g>

                {/* Step 3: Heating & Bubbles */}
                {step === 3 && (
                    <g>
                        <path d="M80 150 C 90 140, 110 140, 120 150 L 130 170 L 70 170 Z" fill="#67e8f9" />
                        {[...Array(5)].map((_, i) => (
                            <circle key={i} cx={85 + Math.random() * 30} cy="160" r={2 + Math.random() * 2} fill="white" opacity="0.7">
                                <animate attributeName="cy" from="165" to="145" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.7" to="0" dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
                            </circle>
                        ))}
                    </g>
                )}

                {/* Step 4-5: Crystallization */}
                {step >= 4 && (
                     <path d="M80 150 C 90 140, 110 140, 120 150 L 130 170 L 70 170 Z" fill="#cffafe" />
                )}
                {step >= 5 && (
                    <g>
                        {[...Array(20)].map((_, i) => {
                             const x = 80 + Math.random() * 40;
                             const y = 150 + Math.random() * 20;
                             return (
                                <path key={i} d={`M${x-2} ${y} L${x} ${y-2} L${x+2} ${y} L${x} ${y+2} Z`} fill="white">
                                    <animate attributeName="opacity" from="0" to="1" dur="1s" begin={`${i*0.1}s`} fill="freeze" />
                                </path>
                             )
                        })}
                    </g>
                )}

                 {/* Step 6-7: Final Product */}
                {step >= 6 && (
                    <g>
                        <path d="M80 168 C 90 155, 110 155, 120 168 L 130 170 L 70 170 Z" fill="#f0f9ff" />
                        {[...Array(20)].map((_, i) => {
                             const x = 80 + Math.random() * 40;
                             const y = 155 + Math.random() * 15;
                             return <path key={i} d={`M${x-2} ${y} L${x} ${y-2} L${x+2} ${y} L${x} ${y+2} Z`} fill="white" />
                        })}
                    </g>
                )}
            </svg>
        </div>
    );
};


const OrganicSynthesis: React.FC = () => {
  const [steps, setSteps] = useState<SynthesisStep[]>(initialSteps);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = useMemo(() => steps.find(s => s.status === 'active')?.id ?? 0, [steps]);
  const completedSteps = useMemo(() => steps.filter(s => s.status === 'completed').length, [steps]);

  const handleNextStep = () => {
    if (isComplete) {
      setSteps(initialSteps);
      setIsComplete(false);
      return;
    }

    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      const activeIndex = newSteps.findIndex(s => s.status === 'active');

      if (activeIndex !== -1) {
        newSteps[activeIndex].status = 'completed';
        if (activeIndex + 1 < newSteps.length) {
          newSteps[activeIndex + 1].status = 'active';
        } else {
          setIsComplete(true);
        }
      }
      return newSteps;
    });
  };
  
  const results = useMemo(() => {
    const theoreticalYield = (2.0 / 138.12) * 180.16;
    const actualYield = theoreticalYield * 0.85;
    const purity = 96.8;
    return { theoreticalYield, actualYield, purity };
  }, []);

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">有機合成反應：阿斯匹靈合成</h2>
        <p className="text-gray-500 mt-1">
          依序操作步驟，模擬阿斯匹靈的合成，並在結束後查看產率與純度。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-8">
           <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <BeakerIcon className="h-6 w-6 mr-2 text-cyan-500" />
              實驗步驟
            </h3>
             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${(completedSteps / steps.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
              {steps.map((step) => (
                <div key={step.id} className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${
                  step.status === 'completed' ? 'border-green-500 bg-green-50' :
                  step.status === 'active' ? 'border-cyan-500 bg-cyan-50 scale-105 shadow' :
                  'border-gray-300 bg-gray-50'
                }`}>
                  <p className={`font-semibold ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-800'}`}>{step.id}. {step.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8 min-h-[500px]">
          <AspirinSynthesisAnimation step={currentStep} />
          {isComplete ? (
            <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
                實驗結果
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center justify-between"><span className="font-medium text-gray-600">理論產量</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{results.theoreticalYield.toFixed(2)} g</span></li>
                <li className="flex items-center justify-between"><span className="font-medium text-gray-600">實際產量</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{results.actualYield.toFixed(2)} g</span></li>
                <li className="flex items-center justify-between"><span className="font-medium text-gray-600">產率</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{(results.actualYield / results.theoreticalYield * 100).toFixed(1)} %</span></li>
                <li className="flex items-center justify-between"><span className="font-medium text-gray-600">純度 (模擬)</span><span className="font-mono text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md text-base">{results.purity.toFixed(1)} %</span></li>
              </ul>
            </div>
          ) : <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">結果將在實驗完成後顯示。</div>}
          
           <button
              onClick={handleNextStep}
              className="w-full mt-auto py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white transition-colors duration-300 bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              {isComplete ? '重新實驗' : `完成步驟 ${currentStep}：${steps.find(s=>s.id === currentStep)?.name || ''}`}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrganicSynthesis;
