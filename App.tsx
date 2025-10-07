
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './pages/Welcome';
import NanomaterialsSynthesis from './pages/NanomaterialsSynthesis';
import SpectroscopyAnalysis from './pages/SpectroscopyAnalysis';
import QuantumChemistry from './pages/QuantumChemistry';
import OrganicSynthesis from './pages/OrganicSynthesis';
import ElectrochemicalAnalysis from './pages/ElectrochemicalAnalysis';
import ChemicalEngineering from './pages/ChemicalEngineering';
import DrugDesign from './pages/DrugDesign';
import type { Experiment } from './types';
import { EXPERIMENTS } from './data/experimentData';

const App: React.FC = () => {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  const renderContent = () => {
    if (!selectedExperiment) {
      return <Welcome onSelectFirstExperiment={() => setSelectedExperiment(EXPERIMENTS[0])} />;
    }
    
    switch (selectedExperiment.id) {
      case 'nanomaterials-synthesis':
        return <NanomaterialsSynthesis />;
      case 'spectroscopy-analysis':
        return <SpectroscopyAnalysis />;
      case 'quantum-chemistry-experiments':
        return <QuantumChemistry />;
      case 'organic-synthesis-reactions':
        return <OrganicSynthesis />;
      case 'electrochemical-analysis':
        return <ElectrochemicalAnalysis />;
      case 'chemical-engineering-simulation':
        return <ChemicalEngineering />;
      case 'drug-design-screening':
        return <DrugDesign />;
      default:
        return <div className="p-4">Experiment not found.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50 text-gray-800 antialiased">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          experiments={EXPERIMENTS}
          onSelectExperiment={setSelectedExperiment}
          selectedExperimentId={selectedExperiment?.id}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
