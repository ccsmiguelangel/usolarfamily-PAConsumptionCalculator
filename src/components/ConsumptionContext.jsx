import { createContext, useContext, useState } from 'react';
import { useConsumptionData } from '../hooks/useConsumptionData';
import { useCostCalculations } from '../hooks/useCostCalculations';
import { useSolarPanelCalculations } from '../hooks/useSolarPanelCalculations';
import { useSystemPricing } from '../hooks/useSystemPricing';
import { useConsumptionActions } from '../hooks/useConsumptionActions';
import { useProjectionData } from '../hooks/useProjectionData';

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  // Additional states that are not in the hooks
  const [clientInfo, setClientInfo] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(150);
  const [loanRateFactor, setLoanRateFactor] = useState('6.5');

  // Hook for consumption data
  const consumptionData = useConsumptionData();
  const { consumptions, setConsumptions, filledConsumptions, totalConsumption } = consumptionData;

  // Hook for cost calculations
  const costCalculations = useCostCalculations(consumptions);
  const { averageMonthlyCost, growthRate, selectedRate, inflationRate } = costCalculations;

  // Hook for solar panel calculations
  const solarPanelCalculations = useSolarPanelCalculations(filledConsumptions, totalConsumption);
  const { calculatedTotalPanelsWatts } = solarPanelCalculations;

  // Hook for system pricing
  const systemPricing = useSystemPricing(calculatedTotalPanelsWatts, selectedPeriod, loanRateFactor, selectedRate);
  const { loanMonthlyPayment } = systemPricing;

  // Hook for consumption actions
  const consumptionActions = useConsumptionActions(consumptions, setConsumptions);

  // Hook for projection data
  const projectionData = useProjectionData(loanMonthlyPayment, averageMonthlyCost, growthRate, loanRateFactor, selectedPeriod, inflationRate);

  return (
    <ConsumptionContext.Provider value={{
      // Main states
      ...consumptionData,
      ...costCalculations,
      ...solarPanelCalculations,
      ...systemPricing,
      ...consumptionActions,
      ...projectionData,
      clientInfo, setClientInfo,
      selectedPeriod, setSelectedPeriod,
      loanRateFactor, setLoanRateFactor,
      // Ensure these values are always available
      totalNaturgyEnsa: projectionData?.totalNaturgyEnsa || 0,
      totalNewProjection: projectionData?.totalNewProjection || 0,
    }}>
      {children}
    </ConsumptionContext.Provider>
  );
}

export function useConsumption() {
  return useContext(ConsumptionContext);
} 