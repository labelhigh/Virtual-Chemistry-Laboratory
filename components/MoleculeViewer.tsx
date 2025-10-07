import React from 'react';
import type { QuantumMolecule, OrbitalData } from '../types';

const ATOM_COLORS = { C: '#222831', H: '#adb5bd' };
const ATOM_RADII = { C: 10, H: 6 };
const ORBITAL_COLORS = { positive: '#ef4444', negative: '#3b82f6' };

// FIX: Define MoleculeViewerProps interface to type the component's props.
interface MoleculeViewerProps {
  molecule: QuantumMolecule;
  orbital?: OrbitalData;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ molecule, orbital }) => {
  // Find the bounding box of the molecule's 2D projection to center and scale it.
  const allAtomPositions = molecule.atoms.map(a => a.position);
  if (allAtomPositions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md h-full w-full flex items-center justify-center">
        <p className="text-gray-500">No molecule data.</p>
      </div>
    );
  }

  const minX = Math.min(...allAtomPositions.map(p => p[0]));
  const maxX = Math.max(...allAtomPositions.map(p => p[0]));
  const minY = Math.min(...allAtomPositions.map(p => p[1]));
  const maxY = Math.max(...allAtomPositions.map(p => p[1]));

  const moleculeWidth = maxX - minX;
  const moleculeHeight = maxY - minY;
  const scale = 80 / Math.max(moleculeWidth, moleculeHeight, 2); // Use a fixed viewport size of 80 units

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const orbitalPoints = orbital ? [
    ...orbital.positiveLobe.map(p => ({ pos: p, type: 'positive' as const })),
    ...orbital.negativeLobe.map(p => ({ pos: p, type: 'negative' as const })),
  ] : [];

  return (
    <div className="bg-white rounded-xl shadow-md h-full w-full flex items-center justify-center overflow-hidden relative p-4">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(3deg) scale(1.02); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 4px rgba(0,0,0,0.1); }
          50% { transform: scale(1.05); box-shadow: 0 0 8px rgba(0,0,0,0.2); }
        }
        @keyframes orbital-shimmer {
            0% { opacity: 0.3; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.7; transform: scale(1.05) rotate(180deg); }
            100% { opacity: 0.3; transform: scale(1) rotate(360deg); }
        }
      `}</style>
      <div className="relative animate-[float_10s_ease-in-out_infinite] w-full h-full">
        <div className="absolute top-1/2 left-1/2">
            {/* Render Orbitals First (background) */}
            {orbitalPoints.map((p, i) => {
              const x = (p.pos[0] - centerX) * scale;
              const y = (p.pos[1] - centerY) * scale;
              const color = ORBITAL_COLORS[p.type];
              return (
                <div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: '8px',
                    height: '8px',
                    backgroundColor: color,
                    transform: 'translate(-50%, -50%)',
                    animation: `orbital-shimmer 4s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              );
            })}

            {/* Render Bonds */}
            {molecule.bonds.map((bond, i) => {
              const atom1 = molecule.atoms[bond[0]].position;
              const atom2 = molecule.atoms[bond[1]].position;
              const p1 = { x: (atom1[0] - centerX) * scale, y: (atom1[1] - centerY) * scale };
              const p2 = { x: (atom2[0] - centerX) * scale, y: (atom2[1] - centerY) * scale };

              const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
              const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <div
                  key={`bond-${i}`}
                  className="absolute bg-gray-400 rounded"
                  style={{
                    height: '5px',
                    width: `${length}px`,
                    left: `${midX}px`,
                    top: `${midY}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                />
              );
            })}

            {/* Render Atoms Last (foreground) */}
            {molecule.atoms.map((atom, i) => {
              const x = (atom.position[0] - centerX) * scale;
              const y = (atom.position[1] - centerY) * scale;
              const radius = ATOM_RADII[atom.element];
              const color = ATOM_COLORS[atom.element];
              return (
                <div
                  key={`atom-${i}`}
                  className="absolute rounded-full z-10 border-2 border-white/50"
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    backgroundColor: color,
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    animation: `pulse 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MoleculeViewer;