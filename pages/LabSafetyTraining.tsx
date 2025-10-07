
import React, { useState } from 'react';
import { CheckCircleIcon } from '../components/icons';

interface LabSafetyTrainingProps {
  onComplete: () => void;
}

const safetyTopics = [
  "辨識化學品危害標示 (GHS)",
  "化學品洩漏標準作業程序 (SOP)",
  "火災與傷害的緊急應變程序",
  "個人防護裝備 (PPE) 的正確使用",
  "廢棄物處理規範",
  "絕不將水加入濃酸中",
  "務必在通風良好的地方進行實驗"
];

const LabSafetyTraining: React.FC<LabSafetyTrainingProps> = ({ onComplete }) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const handleCheck = (index: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const allChecked = checkedItems.size === safetyTopics.length;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-200/80">
        <h2 className="text-3xl font-bold text-center text-cyan-600 mb-2">實驗室安全訓練</h2>
        <p className="text-center text-gray-500 mb-8">
          請確認所有安全守則以解鎖虛擬實驗室。
        </p>
        <div className="space-y-4">
          {safetyTopics.map((topic, index) => (
            <div key={index} className="flex items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-200 transition-colors">
              <input
                type="checkbox"
                id={`topic-${index}`}
                checked={checkedItems.has(index)}
                onChange={() => handleCheck(index)}
                className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 bg-white cursor-pointer"
              />
              <label htmlFor={`topic-${index}`} className="ml-3 block text-gray-700 font-medium cursor-pointer">
                {topic}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={onComplete}
          disabled={!allChecked}
          className={`w-full mt-8 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-300
            ${allChecked 
              ? 'bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-white' 
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          {allChecked ? <span className="flex items-center justify-center"><CheckCircleIcon className="h-6 w-6 mr-2"/> 完成訓練</span> : '請確認所有項目'}
        </button>
      </div>
    </div>
  );
};

export default LabSafetyTraining;