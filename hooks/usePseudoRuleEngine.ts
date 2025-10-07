
import { useState, useEffect, useCallback } from 'react';
import type { NanoparticleParameters, NanoparticleResult } from '../types';
import { SIMULATION_DATA, DEFAULT_PARAMS } from '../data/experimentData';

// This function finds the closest matching data point to the current parameters.
// It creates a "key" from concentration and temperature to look up in the SIMULATION_DATA map.
const findMatchingData = (params: NanoparticleParameters): NanoparticleResult => {
  const tempStep = 5;
  const concStep = 0.1;

  const closestTemp = Math.round(params.temperature / tempStep) * tempStep;
  const closestConc = parseFloat((Math.round(params.concentration / concStep) * concStep).toFixed(1));

  const key = `${closestConc}-${closestTemp}`;
  return SIMULATION_DATA[key] || SIMULATION_DATA[DEFAULT_PARAMS]; // Fallback to default
};

export const usePseudoRuleEngine = (initialParams: NanoparticleParameters) => {
  const [parameters, setParameters] = useState<NanoparticleParameters>(initialParams);
  const [result, setResult] = useState<NanoparticleResult>(() => findMatchingData(initialParams));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate async data fetching from a "backend" to mimic a real SaaS platform
    const timer = setTimeout(() => {
      const data = findMatchingData(parameters);
      setResult(data);
      setIsLoading(false);
    }, 300); // 300ms delay for simulation

    return () => clearTimeout(timer);
  }, [parameters]);

  const updateParameters = useCallback((newParams: Partial<NanoparticleParameters>) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  }, []);

  return { parameters, result, isLoading, updateParameters };
};
