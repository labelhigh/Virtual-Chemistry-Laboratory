
import React from 'react';
import { BeakerIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="flex items-center space-x-3">
        <BeakerIcon className="h-8 w-8 text-cyan-500" />
        <h1 className="text-xl font-bold tracking-wider text-gray-800">
          新世代虛擬化學實驗室
        </h1>
      </div>
      <div className="text-sm text-gray-500">SaaS 平台</div>
    </header>
  );
};

export default Header;