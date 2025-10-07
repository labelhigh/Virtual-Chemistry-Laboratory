import React from 'react';
import type { Experiment } from '../types';
import { BeakerIcon } from './icons';

interface SidebarProps {
  experiments: Experiment[];
  onSelectExperiment: (experiment: Experiment) => void;
  selectedExperimentId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ experiments, onSelectExperiment, selectedExperimentId }) => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 px-3">實驗項目</h2>
      <nav>
        <ul>
          {experiments.map((exp) => (
            <li key={exp.id} className="mb-2">
              <button
                onClick={() => onSelectExperiment(exp)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                  selectedExperimentId === exp.id
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BeakerIcon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-grow font-medium">{exp.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;