import { useState, useMemo, useEffect } from 'react';

export function useSolarPanelCalculations(filledConsumptions, totalConsumption) {
  const [panelWatts, setPanelWatts] = useState('');
  const [additionalPanels, setAdditionalPanels] = useState('');
  const [totalPanelsWatts, setTotalPanelsWatts] = useState(0);
  const [annualProduction, setAnnualProduction] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [roofSquareMeters, setRoofSquareMeters] = useState(0);

  // Calculate system size
  const systemSize = useMemo(() => {
    if (!filledConsumptions) return 0;
    return totalConsumption / 1250;
  }, [totalConsumption, filledConsumptions]);

  // Calculate number of panels
  const numberOfPanels = useMemo(() => {
    const panelWattsNum = Number(panelWatts) || 0;
    if (!panelWattsNum || panelWattsNum === 0 || !filledConsumptions) return 0;
    return Math.ceil((systemSize * 1000) / panelWattsNum);
  }, [systemSize, panelWatts, filledConsumptions]);

  // Total number of panels (calculated + additional)
  const totalPanelsWithAdjustment = useMemo(() => {
    const additionalPanelsNum = Number(additionalPanels) || 0;
    return numberOfPanels + additionalPanelsNum;
  }, [numberOfPanels, additionalPanels]);

  // Calculate total panel power in kW
  const calculatedTotalPanelsWatts = useMemo(() => {
    const panelWattsNum = Number(panelWatts) || 0;
    if (!panelWattsNum || panelWattsNum === 0 || !filledConsumptions || totalConsumption === 0) {
      return 0;
    }
    return totalPanelsWithAdjustment * panelWattsNum / 1000;
  }, [totalPanelsWithAdjustment, panelWatts, totalConsumption, filledConsumptions]);

  // Calculate estimated annual production in kWh
  const calculatedAnnualProduction = useMemo(() => {
    return calculatedTotalPanelsWatts * 4.5 * 365;
  }, [calculatedTotalPanelsWatts]);

  // Calculate coverage percentage
  const calculatedCoverage = useMemo(() => {
    if (systemSize === 0) return 0;
    return (calculatedTotalPanelsWatts / systemSize) * 100;
  }, [calculatedTotalPanelsWatts, systemSize]);

  // Effect to synchronize states with calculations
  useEffect(() => {
    setTotalPanelsWatts(calculatedTotalPanelsWatts);
    setAnnualProduction(calculatedAnnualProduction);
    setCoverage(calculatedCoverage);
  }, [calculatedTotalPanelsWatts, calculatedAnnualProduction, calculatedCoverage]);

  // Calculate consumption coverage percentage
  const consumptionCoveragePercentage = useMemo(() => {
    return calculatedCoverage;
  }, [calculatedCoverage]);

  // Solar panel area in m2
  const panelArea = 2.45;

  // Total area occupied by calculated panels
  const totalPanelsArea = useMemo(() => {
    return totalPanelsWithAdjustment * panelArea;
  }, [totalPanelsWithAdjustment]);

  // Maximum panels that fit on the roof
  const maxPanelsByRoof = useMemo(() => {
    return roofSquareMeters > 0 ? Math.floor(roofSquareMeters / panelArea) : 0;
  }, [roofSquareMeters]);

  // Do all necessary panels fit?
  const canFitAllPanels = useMemo(() => {
    return totalPanelsWithAdjustment <= maxPanelsByRoof;
  }, [totalPanelsWithAdjustment, maxPanelsByRoof]);

  return {
    panelWatts, setPanelWatts,
    additionalPanels, setAdditionalPanels,
    totalPanelsWatts, setTotalPanelsWatts,
    annualProduction, setAnnualProduction,
    coverage, setCoverage,
    roofSquareMeters, setRoofSquareMeters,
    systemSize,
    numberOfPanels,
    consumptionCoveragePercentage,
    calculatedTotalPanelsWatts,
    panelArea,
    totalPanelsArea,
    totalPanelsWithAdjustment,
    maxPanelsByRoof,
    canFitAllPanels,
  };
} 