import { useState, useMemo } from 'react';

export function useSystemPricing(calculatedTotalPanelsWatts, selectedPeriod = 150, loanRateFactor = '6.5', selectedRate = 4, batteryPrice = 0) {
  const [systemPriceMultiplier, setSystemPriceMultiplier] = useState('');

  // Calculate approximate total system price
  const defaultPricePerWatt = 1.1;
  
  const systemTotalPrice = useMemo(() => {
    return calculatedTotalPanelsWatts > 0 ? calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt : 0;
  }, [calculatedTotalPanelsWatts]);

  // Price adjusted according to multiplier
  const systemTotalPriceAdjusted = useMemo(() => {
    const systemPriceMultiplierNum = Number(systemPriceMultiplier) || 0;
    if (calculatedTotalPanelsWatts > 0) {
      // Con paneles: aplicar multiplicador si existe
      if (systemPriceMultiplierNum >= -0.2) {
        return calculatedTotalPanelsWatts * 1000 * (defaultPricePerWatt + systemPriceMultiplierNum);
      } else {
        return calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt;
      }
    } else {
      // Solo batería: retornar 0 (no hay paneles)
      return 0;
    }
  }, [calculatedTotalPanelsWatts, systemPriceMultiplier]);

  const systemTotalPriceWithNewTax = useMemo(() => {
    return systemTotalPriceAdjusted / 0.78;
  }, [systemTotalPriceAdjusted]);

  // Precio total incluyendo batería
  const systemTotalPriceWithBattery = useMemo(() => {
    return systemTotalPrice + batteryPrice;
  }, [systemTotalPrice, batteryPrice]);

  const systemTotalPriceAdjustedWithBattery = useMemo(() => {
    const systemPriceMultiplierNum = Number(systemPriceMultiplier) || 0;
    if (calculatedTotalPanelsWatts > 0) {
      // Con paneles: aplicar multiplicador si existe
      if (systemPriceMultiplierNum >= -0.2) {
        return (calculatedTotalPanelsWatts * 1000 * (defaultPricePerWatt + systemPriceMultiplierNum)) + batteryPrice;
      } else {
        return (calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt) + batteryPrice;
      }
    } else {
      // Solo batería: retornar solo el precio de la batería
      return batteryPrice;
    }
  }, [calculatedTotalPanelsWatts, systemPriceMultiplier, batteryPrice]);

  const systemTotalPriceWithNewTaxWithBattery = useMemo(() => {
    return systemTotalPriceAdjustedWithBattery / 0.78;
  }, [systemTotalPriceAdjustedWithBattery]);

  // Calculate loan factor for specific credit percentage and months
  const loanFactor = useMemo(() => {
    // Function to calculate loan factor dynamically
    const calculateLoanFactor = (annualRate, months) => {
      const monthlyRate = annualRate / 100 / 12;
      if (monthlyRate === 0) return 1 / months;
      
      const factor = (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
      return factor;
    };

    // Predefined factors for specific combinations
    const predefinedFactors = {
      '12-6.5': 0.086066,
      '12-10.5': 0.088149,
      '24-6.5': 0.044546,
      '24-10.5': 0.046376,
      '48-6.5': 0.023715,
      '48-10.5': 0.025603,
      '72-6.5': 0.01681,
      '72-10.5': 0.018779,
      '96-6.5': 0.013386,
      '96-10.5': 0.01544,
      '120-6.5': 0.011355,
      '120-10.5': 0.013493,
      '150-6.5': 0.009755,
      '150-10.5': 0.011998
    };
    
    // Create key for the specific combination
    const factorKey = `${selectedPeriod}-${loanRateFactor}`;
    
    // Use predefined factor if available, otherwise calculate dynamically
    let baseFactor;
    if (predefinedFactors[factorKey]) {
      baseFactor = predefinedFactors[factorKey];
    } else {
      // Calculate factor dynamically for the specific combination
      baseFactor = calculateLoanFactor(parseFloat(loanRateFactor), selectedPeriod);
    }
    
    // Return the base factor without inflation adjustment
    return baseFactor;
  }, [selectedPeriod, loanRateFactor, selectedRate]);

  // Monthly credit payment
  const loanMonthlyPayment = useMemo(() => {
    return systemTotalPriceWithNewTax * loanFactor;
  }, [systemTotalPriceWithNewTax, loanFactor]);

  // Monthly credit payment with battery
  const loanMonthlyPaymentWithBattery = useMemo(() => {
    return systemTotalPriceWithNewTaxWithBattery * loanFactor;
  }, [systemTotalPriceWithNewTaxWithBattery, loanFactor]);

  // Monthly credit payment for comparison (always without battery for payment calculation)
  const loanMonthlyPaymentForComparison = useMemo(() => {
    return systemTotalPriceWithNewTax * loanFactor;
  }, [systemTotalPriceWithNewTax, loanFactor]);

  // Monthly credit payment based on price without taxes (for display)
  const loanMonthlyPaymentWithoutTax = useMemo(() => {
    return systemTotalPriceAdjusted * loanFactor;
  }, [systemTotalPriceAdjusted, loanFactor]);

  // Monthly credit payment with battery based on price without taxes (for display)
  const loanMonthlyPaymentWithBatteryWithoutTax = useMemo(() => {
    return (systemTotalPriceAdjusted + batteryPrice) * loanFactor;
  }, [systemTotalPriceAdjusted, batteryPrice, loanFactor]);

  // Total paid in credit
  const loanTotalPaid = useMemo(() => {
    return loanMonthlyPayment * selectedPeriod;
  }, [loanMonthlyPayment, selectedPeriod]);

  // Total of new projection at selected period
  const totalNewProjectionSelectedPeriod = useMemo(() => {
    return loanMonthlyPayment * selectedPeriod;
  }, [loanMonthlyPayment, selectedPeriod]);

  return {
    systemPriceMultiplier, setSystemPriceMultiplier,
    loanRateFactor,
    systemTotalPrice,
    systemTotalPriceWithNewTax,
    systemTotalPriceAdjusted,
    systemTotalPriceWithBattery,
    systemTotalPriceAdjustedWithBattery,
    systemTotalPriceWithNewTaxWithBattery,
    loanMonthlyPayment,
    loanMonthlyPaymentWithBattery,
    loanMonthlyPaymentForComparison,
    loanMonthlyPaymentWithoutTax,
    loanMonthlyPaymentWithBatteryWithoutTax,
    loanTotalPaid,
    totalNewProjectionSelectedPeriod,
  };
} 