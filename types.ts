
export interface Experiment {
  id: string;
  title: string;
  category: string;
  description: string;
}

// Nanomaterials Synthesis Types
export interface NanoparticleParameters {
  concentration: number; // 0.1 to 1.0
  temperature: number;   // 25 to 100
}

export interface SpectrumPoint {
  wavelength: number;
  absorbance: number;
}

export interface NanoparticleResult {
  particleSize: number; // in nm
  color: string;
  solutionColor: string;
  spectrum: SpectrumPoint[];
}

export interface SimulationData {
  [key: string]: NanoparticleResult;
}

// Spectroscopy Analysis Types
export interface NMRPeak {
  shift: number;
  multiplicity: 's' | 'd' | 't' | 'q' | 'm'; // singlet, doublet, triplet, quartet, multiplet
  integration: number;
}

export interface MSFragment {
  mz: number;
  intensity: number;
}

export interface UnknownSample {
  id: string;
  name: string;
  displayName: string;
  formula: string;
  nmrData: NMRPeak[];
  msData: MSFragment[];
}

export interface SpectroscopyData {
  [key: string]: UnknownSample;
}

// Quantum Chemistry Types
export type Vec3 = [number, number, number];

export interface Atom {
  element: 'C' | 'H';
  position: Vec3;
}

export type Bond = [number, number]; // Indices of two atoms

export interface OrbitalData {
  energy: number; // in eV
  positiveLobe: Vec3[]; // Point cloud for positive phase
  negativeLobe: Vec3[]; // Point cloud for negative phase
}

export interface QuantumMolecule {
  id: string;
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  homo: OrbitalData;
  lumo: OrbitalData;
}

export interface QuantumChemistryData {
  [key: string]: QuantumMolecule;
}

// Organic Synthesis Types
export interface SynthesisStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

// Electrochemical Analysis Types
export interface CVParameters {
  scanRate: number; // in V/s
  concentration: number; // in mM
}
export interface CVDataPoint {
  voltage: number;
  current: number;
}
export interface CVResult {
  data: CVDataPoint[];
  epa: number | null; // anodic peak potential
  epc: number | null; // cathodic peak potential
  ipa: number | null; // anodic peak current
  ipc: number | null; // cathodic peak current
}

// Chemical Engineering Types
export interface DistillationParameters {
  refluxRatio: number;
  trayCount: number;
}
export interface TrayComposition {
  trayNumber: number;
  ethanolConcentration: number;
}
export interface DistillationResult {
  distillateConcentration: number;
  bottomsConcentration: number;
  compositions: TrayComposition[];
}

// Drug Design Types
export interface Ligand {
  id: string;
  name: string;
  formula: string;
  dockingScore: number; // Lower is better
}

export interface DockingResult extends Ligand {
  status: 'docked' | 'pending' | 'running';
}
