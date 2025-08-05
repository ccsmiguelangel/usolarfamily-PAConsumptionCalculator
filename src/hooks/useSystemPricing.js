import { useState, useMemo } from 'react';

export function useSystemPricing(calculatedTotalPanelsWatts, selectedPeriod = 150, loanRateFactor = '6.5', inflationRate = 4) {
  const [systemPriceMultiplier, setSystemPriceMultiplier] = useState('');

  // Calculate approximate total system price
  const defaultPricePerWatt = 1.1;
  
  const systemTotalPrice = useMemo(() => {
    return calculatedTotalPanelsWatts > 0 ? calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt : 0;
  }, [calculatedTotalPanelsWatts]);

  // Price adjusted according to multiplier
  const systemTotalPriceAdjusted = useMemo(() => {
    const systemPriceMultiplierNum = Number(systemPriceMultiplier) || 0;
    if (systemPriceMultiplierNum >= -0.2 && calculatedTotalPanelsWatts > 0) {
      return calculatedTotalPanelsWatts * 1000 * (defaultPricePerWatt + systemPriceMultiplierNum);
    } else {
      return calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt;
    }
  }, [calculatedTotalPanelsWatts, systemPriceMultiplier]);

  const systemTotalPriceWithNewTax = useMemo(() => {
    return systemTotalPriceAdjusted / 0.78;
  }, [systemTotalPriceAdjusted]);

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
  }, [selectedPeriod, loanRateFactor, inflationRate]);

  // Monthly credit payment
  const loanMonthlyPayment = useMemo(() => {
    return systemTotalPriceWithNewTax * loanFactor;
  }, [systemTotalPriceWithNewTax, loanFactor]);

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
    loanMonthlyPayment,
    loanTotalPaid,
    totalNewProjectionSelectedPeriod,
  };
} 