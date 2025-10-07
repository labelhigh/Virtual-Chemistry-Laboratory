import React from 'react';
import { ShieldCheckIcon, CurrencyDollarIcon, GlobeAltIcon, SparklesIcon } from '../components/icons';

interface WelcomeProps {
    onSelectFirstExperiment: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSelectFirstExperiment }) => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: '絕對安全',
      description: '在 100% 無風險的環境中探索化學反應，無需擔心意外或危險物質。',
    },
    {
      icon: CurrencyDollarIcon,
      title: '節省成本',
      description: '告別昂貴的儀器與耗材。在這裡，您可以無限次重複實驗，無需任何花費。',
    },
    {
      icon: GlobeAltIcon,
      title: '隨時隨地',
      description: '打破物理實驗室的時空限制。只要有網路，您的實驗室就與您同在。',
    },
    {
      icon: SparklesIcon,
      title: '高度擬真',
      description: '我們採用精緻的數據驅動視覺化技術，為您帶來身歷其境的互動模擬體驗。',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-gray-800">歡迎來到新世代虛擬化學實驗室</h2>
        <p className="mt-3 text-lg text-gray-600">
          一個安全、高效且無限制的數位實驗平台
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80 transform hover:-translate-y-1 transition-transform duration-300">
              <feature.icon className="h-10 w-10 mx-auto text-cyan-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
            <p className="text-lg text-gray-700 animate-pulse">
                請從左側選單選擇一個實驗開始您的探索之旅！
            </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;