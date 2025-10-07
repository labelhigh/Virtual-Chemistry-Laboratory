
import React from 'react';
import type { NanoparticleParameters } from '../types';
import { SettingsIcon } from './icons';

interface ControlPanelProps {
  parameters: NanoparticleParameters;
  onParameterChange: (newParams: Partial<NanoparticleParameters>) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ parameters, onParameterChange, isLoading }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${isLoading ? 'opacity-70 animate-pulse' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
        <SettingsIcon className="h-6 w-6 mr-2 text-cyan-500" />
        控制面板
      </h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="concentration" className="block text-sm font-medium text-gray-600 mb-2">
            還原劑濃度 ({parameters.concentration.toFixed(1)} M)
          </label>
          <input
            id="concentration"
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={parameters.concentration}
            onChange={(e) => onParameterChange({ concentration: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-600 mb-2">
            溫度 ({parameters.temperature}°C)
          </label>
          <input
            id="temperature"
            type="range"
            min="25"
            max="100"
            step="5"
            value={parameters.temperature}
            onChange={(e) => onParameterChange({ temperature: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;