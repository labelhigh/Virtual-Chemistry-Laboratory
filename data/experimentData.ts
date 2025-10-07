import type { Experiment, SimulationData, SpectroscopyData, QuantumChemistryData, Vec3 } from '../types';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'nanomaterials-synthesis',
    title: '奈米材料合成',
    category: 'Nanotechnology',
    description: '模擬金奈米粒子的合成，使用者可調整還原劑濃度與溫度，觀察粒子尺寸變化對應的溶液顏色改變（從淡紅色到紫色），並即時生成其UV-Vis吸收光譜圖。'
  },
  {
    id: 'spectroscopy-analysis',
    title: '光譜分析',
    category: 'Analytical Chemistry',
    description: '提供虛擬的核磁共振儀 (NMR) 與質譜儀 (MS)。使用者將「未知」樣品放入儀器，平台會根據預設數據，繪製出對應的¹H NMR、¹³C NMR及MS圖譜，使用者需根據圖譜解析出化合物結構。'
  },
  {
    id: 'quantum-chemistry-experiments',
    title: '量子化學實驗',
    category: 'Quantum Chemistry',
    description: '視覺化呈現不同分子（如苯、乙烯）的最高佔據分子軌域 (HOMO) 與最低未佔據分子軌域 (LUMO)。使用者可以旋轉分子模型，從不同角度觀察軌域形狀。'
  },
  {
    id: 'organic-synthesis-reactions',
    title: '有機合成反應',
    category: 'Organic Chemistry',
    description: '阿斯匹靈合成： 一個完整的多步驟虛擬實驗。使用者需依序操作加料、加熱、攪拌、冷卻、結晶、過濾、乾燥等步驟。每一步操作的精確度都會影響最終的產率與純度。'
  },
  {
    id: 'electrochemical-analysis',
    title: '電化學分析',
    category: 'Physical Chemistry',
    description: '循環伏安法 (Cyclic Voltammetry)： 模擬電極在含有電活性物質的溶液中，掃描電壓時所得到的電流-電壓曲線。使用者可以改變掃描速率或物質濃度，觀察CV圖形的相應變化。'
  },
  {
    id: 'chemical-engineering-simulation',
    title: '化工製程模擬',
    category: 'Chemical Engineering',
    description: '分餾塔操作： 提供一個乙醇-水混合物的虛擬分餾塔。使用者可以設定進料位置、塔板數與迴流比，目標是得到高純度的乙醇。'
  },
  {
    id: 'drug-design-screening',
    title: '藥物設計與篩選',
    category: 'Medicinal Chemistry',
    description: '提供一個蛋白質靶點的三維結構，使用者可以從虛擬的化合物庫中選擇不同的分子，進行「分子對接」模擬，並根據親和力數據給出結合能量分數。'
  }
];

// --- Nanomaterials Synthesis Data ---

// Helper to generate a gaussian peak for the spectrum
const generateUVSpectrum = (peakWavelength: number, peakAbsorbance: number, width: number) => {
  const spectrum = [];
  for (let wavelength = 400; wavelength <= 800; wavelength += 2) {
    const absorbance = peakAbsorbance * Math.exp(-Math.pow((wavelength - peakWavelength), 2) / (2 * Math.pow(width, 2))) + (Math.random() * 0.02);
    spectrum.push({ wavelength, absorbance: Math.max(0, absorbance) });
  }
  return spectrum;
};

export const DEFAULT_PARAMS = '0.5-25';

// Pre-defined data for the Pseudo Rules Engine
// Key format: `${concentration}-${temperature}`
export const SIMULATION_DATA: SimulationData = {
  '0.1-25': { particleSize: 10, color: 'red-500', solutionColor: '#ef4444', spectrum: generateUVSpectrum(520, 0.4, 30) },
  '0.5-25': { particleSize: 15, color: 'red-400', solutionColor: '#f87171', spectrum: generateUVSpectrum(525, 0.6, 35) },
  '1.0-25': { particleSize: 20, color: 'red-300', solutionColor: '#fca5a5', spectrum: generateUVSpectrum(530, 0.8, 40) },
  
  '0.1-60': { particleSize: 25, color: 'purple-500', solutionColor: '#a855f7', spectrum: generateUVSpectrum(535, 0.7, 45) },
  '0.5-60': { particleSize: 40, color: 'purple-400', solutionColor: '#c084fc', spectrum: generateUVSpectrum(550, 0.9, 50) },
  '1.0-60': { particleSize: 60, color: 'purple-300', solutionColor: '#d8b4fe', spectrum: generateUVSpectrum(565, 1.1, 55) },
  
  '0.1-100': { particleSize: 70, color: 'blue-500', solutionColor: '#3b82f6', spectrum: generateUVSpectrum(575, 1.0, 60) },
  '0.5-100': { particleSize: 85, color: 'blue-400', solutionColor: '#60a5fa', spectrum: generateUVSpectrum(590, 1.2, 65) },
  '1.0-100': { particleSize: 100, color: 'blue-300', solutionColor: '#93c5fd', spectrum: generateUVSpectrum(610, 1.4, 70) },
};

// Auto-fill missing data points by interpolation (simplified)
const concentrations = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const temperatures = Array.from({length: 16}, (_, i) => 25 + i * 5); // 25, 30, ..., 100

for (const conc of concentrations) {
    for (const temp of temperatures) {
        const key = `${conc.toFixed(1)}-${temp}`;
        if (SIMULATION_DATA[key]) continue;

        // Find neighbors for simple interpolation - this is a mock, so we just use the base values
        const baseTemp = temp < 60 ? 25 : (temp < 100 ? 60 : 100);
        const baseConc = conc < 0.5 ? 0.1 : (conc < 1.0 ? 0.5 : 1.0);
        const baseKey = `${baseConc.toFixed(1)}-${baseTemp}`;
        
        const baseData = SIMULATION_DATA[baseKey];

        // Add a guard to ensure baseData and its spectrum are valid before access
        if (baseData && baseData.spectrum && baseData.spectrum.length > 0) {
            const tempFactor = (temp - 25) / 75; // Normalize temp 0-1
            const concFactor = (conc - 0.1) / 0.9; // Normalize conc 0-1
            
            const newSize = baseData.particleSize + (tempFactor * 30) + (concFactor * 10);
            
            // Find the actual peak of the base spectrum for more realistic interpolation.
            // This fixes the error and improves simulation quality.
            const peakPoint = baseData.spectrum.reduce(
                (max, p) => (p.absorbance > max.absorbance ? p : max),
                baseData.spectrum[0]
            );

            const newPeak = peakPoint.wavelength + (tempFactor * 40) + (concFactor * 15);
            const newAbsorbance = peakPoint.absorbance + (tempFactor * 0.4) + (concFactor * 0.2);

            SIMULATION_DATA[key] = {
                ...baseData,
                particleSize: newSize,
                spectrum: generateUVSpectrum(newPeak, newAbsorbance, 40 + tempFactor * 20)
            };
        }
    }
}


// --- Spectroscopy Analysis Data ---

export const SPECTROSCOPY_DATA: SpectroscopyData = {
  'sample-a': {
    id: 'sample-a',
    displayName: '未知樣品 A',
    name: '乙醇 (Ethanol)',
    formula: 'C₂H₅OH',
    nmrData: [
      { shift: 1.22, multiplicity: 't', integration: 3 }, // CH3
      { shift: 3.68, multiplicity: 'q', integration: 2 }, // CH2
      { shift: 2.50, multiplicity: 's', integration: 1 }, // OH (broad singlet)
    ],
    msData: [
      { mz: 46, intensity: 45 },  // M+
      { mz: 45, intensity: 100 }, // [M-H]+
      { mz: 31, intensity: 75 },  // [CH2OH]+
      { mz: 29, intensity: 50 },  // [C2H5]+
    ],
  },
  'sample-b': {
    id: 'sample-b',
    displayName: '未知樣品 B',
    name: '丙酮 (Acetone)',
    formula: 'C₃H₆O',
    nmrData: [
      { shift: 2.16, multiplicity: 's', integration: 6 }, // Two CH3 groups
    ],
    msData: [
      { mz: 58, intensity: 80 },  // M+
      { mz: 43, intensity: 100 }, // [CH3CO]+
      { mz: 15, intensity: 40 },  // [CH3]+
    ]
  }
};

// --- Quantum Chemistry Data ---
// Helper to generate a dumbbell-shaped p-orbital point cloud
const generatePOrbital = (center: Vec3, axis: 'x' | 'y' | 'z', scale: number, numPoints: number): Vec3[] => {
    const points: Vec3[] = [];
    const [cx, cy, cz] = center;
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const r = Math.sin(phi) * Math.cos(theta) * Math.sin(2 * phi) * scale;
        
        let dx = r * Math.sin(phi) * Math.cos(theta);
        let dy = r * Math.sin(phi) * Math.sin(theta);
        let dz = r * Math.cos(phi);

        if (axis === 'x') {
            points.push([cx + dz, cy + dx, cz + dy]);
        } else if (axis === 'y') {
            points.push([cx + dx, cy + dz, cz + dy]);
        } else { // 'z'
            points.push([cx + dx, cy + dy, cz + dz]);
        }
    }
    return points;
};


export const QUANTUM_CHEMISTRY_DATA: QuantumChemistryData = {
    'ethylene': {
        id: 'ethylene',
        name: '乙烯 (Ethylene)',
        formula: 'C₂H₄',
        atoms: [
            { element: 'C', position: [-0.67, 0, 0] },
            { element: 'C', position: [0.67, 0, 0] },
            { element: 'H', position: [-1.24, 0.94, 0] },
            { element: 'H', position: [-1.24, -0.94, 0] },
            { element: 'H', position: [1.24, 0.94, 0] },
            { element: 'H', position: [1.24, -0.94, 0] },
        ],
        bonds: [ [0, 1], [0, 2], [0, 3], [1, 4], [1, 5] ],
        homo: { // Pi bonding orbital
            energy: -10.51,
            positiveLobe: generatePOrbital([0, 0, 0.5], 'z', 2.5, 800),
            negativeLobe: generatePOrbital([0, 0, -0.5], 'z', 2.5, 800),
        },
        lumo: { // Pi anti-bonding orbital
            energy: 1.25,
            positiveLobe: [
                ...generatePOrbital([-0.67, 0, 0.5], 'z', 1.8, 400),
                ...generatePOrbital([0.67, 0, -0.5], 'z', 1.8, 400),
            ],
            negativeLobe: [
                ...generatePOrbital([-0.67, 0, -0.5], 'z', 1.8, 400),
                ...generatePOrbital([0.67, 0, 0.5], 'z', 1.8, 400),
            ],
        },
    },
    'benzene': {
        id: 'benzene',
        name: '苯 (Benzene)',
        formula: 'C₆H₆',
        atoms: [
            ...Array.from({ length: 6 }, (_, i) => ({
                element: 'C' as 'C',
                position: [1.4 * Math.cos(i * Math.PI / 3), 1.4 * Math.sin(i * Math.PI / 3), 0] as Vec3,
            })),
            ...Array.from({ length: 6 }, (_, i) => ({
                element: 'H' as 'H',
                position: [2.5 * Math.cos(i * Math.PI / 3), 2.5 * Math.sin(i * Math.PI / 3), 0] as Vec3,
            })),
        ],
        bonds: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
            [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]
        ],
        homo: { // One of the two degenerate HOMO orbitals
            energy: -9.24,
            positiveLobe: [
                ...generatePOrbital([1.4, 0, 0.5], 'z', 1.6, 200),
                ...generatePOrbital([0.7, -1.21, 0.5], 'z', 1.6, 200),
                ...generatePOrbital([-0.7, 1.21, 0.5], 'z', 1.6, 200),
            ],
            negativeLobe: [
                ...generatePOrbital([-1.4, 0, 0.5], 'z', 1.6, 200),
                ...generatePOrbital([-0.7, -1.21, 0.5], 'z', 1.6, 200),
                ...generatePOrbital([0.7, 1.21, 0.5], 'z', 1.6, 200),
            ],
        },
        lumo: { // One of the two degenerate LUMO orbitals
            energy: -1.15,
            positiveLobe: [
                ...generatePOrbital([1.4, 0, 0.5], 'z', 1.6, 200),
                 ...generatePOrbital([-0.7, 1.21, 0.5], 'z', 1.6, 200),
                 ...generatePOrbital([-0.7, -1.21, -0.5], 'z', 1.6, 200),
            ],
            negativeLobe: [
                ...generatePOrbital([-1.4, 0, 0.5], 'z', 1.6, 200),
                ...generatePOrbital([0.7, 1.21, -0.5], 'z', 1.6, 200),
                ...generatePOrbital([0.7, -1.21, 0.5], 'z', 1.6, 200),
            ],
        },
    },
};