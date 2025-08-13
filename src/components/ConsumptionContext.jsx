import { createContext, useContext, useState } from 'react';
import { useConsumptionData } from '../hooks/useConsumptionData';
import { useCostCalculations } from '../hooks/useCostCalculations';
import { useSolarPanelCalculations } from '../hooks/useSolarPanelCalculations';
import { useSystemPricing } from '../hooks/useSystemPricing';
import { useConsumptionActions } from '../hooks/useConsumptionActions';
import { useProjectionData } from '../hooks/useProjectionData';
import { useBatterySystem } from '../hooks/useBatterySystem';

const ConsumptionContext = createContext();

export function ConsumptionProvider({ children }) {
  // Additional states that are not in the hooks
  const [clientInfo, setClientInfo] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(150);
  const [loanRateFactor, setLoanRateFactor] = useState('6.5');

  // Try-catch wrapper para manejar errores en los hooks
  let consumptionData, costCalculations, solarPanelCalculations, batterySystem, systemPricing, consumptionActions, projectionData, projectionDataWithBattery, projectionDataForComparison, projectionDataWithBatteryActive;

  try {

  // Hook for consumption data
  consumptionData = useConsumptionData();
  const { consumptions = [], setConsumptions, filledConsumptions = false, totalConsumption = 0 } = consumptionData || {};

  // Hook for cost calculations
  costCalculations = useCostCalculations(consumptions);
  const { averageMonthlyCost = 0, selectedRate = 3, inflationRate = 4 } = costCalculations || {};

  // Hook for solar panel calculations
  solarPanelCalculations = useSolarPanelCalculations(filledConsumptions, totalConsumption);
  const { calculatedTotalPanelsWatts = 0, systemSize = 0 } = solarPanelCalculations || {};

  // Hook for battery system
  batterySystem = useBatterySystem(systemSize);
  const { batteryPrice = 0, wantsBattery = false } = batterySystem || {};

  // Hook for system pricing
  systemPricing = useSystemPricing(calculatedTotalPanelsWatts, selectedPeriod, loanRateFactor, selectedRate, batteryPrice);
  const { 
    loanMonthlyPayment = 0, 
    loanMonthlyPaymentWithBattery = 0, 
    loanMonthlyPaymentForComparison = 0,
    loanMonthlyPaymentWithoutTax = 0,
    loanMonthlyPaymentWithBatteryWithoutTax = 0,
    systemTotalPriceWithNewTax = 0,
    systemTotalPriceWithNewTaxWithBattery = 0
  } = systemPricing || {};

  // Hook for consumption actions
  consumptionActions = useConsumptionActions(consumptions, setConsumptions);

  // Hook for projection data
  projectionData = useProjectionData(loanMonthlyPayment, averageMonthlyCost, inflationRate, loanRateFactor, selectedPeriod);

  // Hook for projection data with battery
  projectionDataWithBattery = useProjectionData(loanMonthlyPaymentWithBattery, averageMonthlyCost, inflationRate, loanRateFactor, selectedPeriod);

  // Hook for projection data for comparison (using payment without battery but total price with battery)
  projectionDataForComparison = useProjectionData(loanMonthlyPaymentForComparison, averageMonthlyCost, inflationRate, loanRateFactor, selectedPeriod);

  // Hook for projection data with battery (when battery is active)
  projectionDataWithBatteryActive = useProjectionData(loanMonthlyPaymentWithBattery, averageMonthlyCost, inflationRate, loanRateFactor, selectedPeriod);

  } catch (error) {
    console.error('Error en ConsumptionProvider:', error);
    // Valores por defecto en caso de error
    consumptionData = { consumptions: [], setConsumptions: () => {}, filledConsumptions: false, totalConsumption: 0 };
    costCalculations = { averageMonthlyCost: 0, selectedRate: 3, inflationRate: 4 };
    solarPanelCalculations = { calculatedTotalPanelsWatts: 0, systemSize: 0 };
    batterySystem = { batteryPrice: 0, wantsBattery: false };
    systemPricing = { 
      loanMonthlyPayment: 0, 
      loanMonthlyPaymentWithBattery: 0, 
      loanMonthlyPaymentForComparison: 0,
      loanMonthlyPaymentWithoutTax: 0,
      loanMonthlyPaymentWithBatteryWithoutTax: 0,
      systemTotalPriceWithNewTax: 0,
      systemTotalPriceWithNewTaxWithBattery: 0
    };
    consumptionActions = {};
    projectionData = { totalNaturgyEnsa: 0, totalNewProjection: 0 };
    projectionDataWithBattery = { totalNaturgyEnsa: 0, totalNewProjection: 0 };
    projectionDataForComparison = { totalNaturgyEnsa: 0, totalNewProjection: 0, comparisonProjectionData: [] };
    projectionDataWithBatteryActive = { totalNaturgyEnsa: 0, totalNewProjection: 0 };
  }

  return (
    <ConsumptionContext.Provider value={{
      // Main states
      ...consumptionData,
      ...costCalculations,
      ...solarPanelCalculations,
      ...systemPricing,
      ...consumptionActions,
      ...projectionData,
      ...batterySystem,
      clientInfo, setClientInfo,
      selectedPeriod, setSelectedPeriod,
      loanRateFactor, setLoanRateFactor,
      // Ensure these values are always available
      totalNaturgyEnsa: projectionData?.totalNaturgyEnsa || 0,
      totalNewProjection: projectionData?.totalNewProjection || 0,
      totalNaturgyEnsaWithBattery: projectionDataWithBattery?.totalNaturgyEnsa || 0,
      totalNewProjectionWithBattery: projectionDataWithBattery?.totalNewProjection || 0,
      
      // New values for comparison with battery active
      totalNaturgyEnsaWithBatteryActive: projectionDataWithBatteryActive?.totalNaturgyEnsa || 0,
      totalNewProjectionWithBatteryActive: projectionDataWithBatteryActive?.totalNewProjection || 0,
      // New values for comparison
      projectionDataForComparison: projectionDataForComparison,
      // Add comparison data for the chart - usar datos con batería si está activa, sino sin batería
      comparisonProjectionData: batterySystem?.wantsBattery ? 
        projectionDataWithBattery?.comparisonProjectionData || [] : 
        projectionData?.comparisonProjectionData || [],
    }}>
      {children}
    </ConsumptionContext.Provider>
  );
}

export function useConsumption() {
  return useContext(ConsumptionContext);
} 