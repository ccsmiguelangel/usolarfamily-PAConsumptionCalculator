import { useState, useMemo } from 'react';

export function useSystemPricing(calculatedTotalPanelsWatts, selectedPeriod = 150) {
  const [systemPriceMultiplier, setSystemPriceMultiplier] = useState('');
  const [loanRateFactor, setLoanRateFactor] = useState('6.5');

  // Calculate approximate total system price
  const defaultPricePerWatt = 1.1;
  
  const systemTotalPrice = useMemo(() => {
    return calculatedTotalPanelsWatts > 0 ? calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt : 0;
  }, [calculatedTotalPanelsWatts]);

  const systemTotalPriceWithNewTax = useMemo(() => {
    return systemTotalPrice * 1.1 / 0.78;
  }, [systemTotalPrice]);

  // Price adjusted according to multiplier
  const systemTotalPriceAdjusted = useMemo(() => {
    const systemPriceMultiplierNum = Number(systemPriceMultiplier) || 0;
    if (systemPriceMultiplierNum >= -0.2 && calculatedTotalPanelsWatts > 0) {
      return calculatedTotalPanelsWatts * 1000 * (defaultPricePerWatt + systemPriceMultiplierNum);
    } else {
      return calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt;
    }
  }, [calculatedTotalPanelsWatts, systemPriceMultiplier]);

  // Credit factors based on selected period
  const loanFactors = useMemo(() => {
    const factors = {
      12: {
        '6.5': 0.086066,
        '10.5': 0.088149
      },
      24: {
        '6.5': 0.044546,
        '10.5': 0.046376
      },
      48: {
        '6.5': 0.023715,
        '10.5': 0.025603
      },
      72: {
        '6.5': 0.01681,
        '10.5': 0.018779
      },
      96: {
        '6.5': 0.013386,
        '10.5': 0.01544
      },
      120: {
        '6.5': 0.011355,
        '10.5': 0.013493
      },
      150: {
        '6.5': 0.009755,
        '10.5': 0.011998
      }
    };
    
    return factors[selectedPeriod] || factors[150]; // Default to 150 months if period not found
  }, [selectedPeriod]);

  // Monthly credit payment
  const loanMonthlyPayment = useMemo(() => {
    return systemTotalPriceAdjusted * loanFactors[loanRateFactor];
  }, [systemTotalPriceAdjusted, loanRateFactor, loanFactors]);

  // Total paid in credit
  const loanTotalPaid = useMemo(() => {
    return loanMonthlyPayment * selectedPeriod / 0.78;
  }, [loanMonthlyPayment, selectedPeriod]);

  // Total of new projection at selected period
  const totalNewProjectionSelectedPeriod = useMemo(() => {
    return loanMonthlyPayment * selectedPeriod;
  }, [loanMonthlyPayment, selectedPeriod]);

  return {
    systemPriceMultiplier, setSystemPriceMultiplier,
    loanRateFactor, setLoanRateFactor,
    systemTotalPrice,
    systemTotalPriceWithNewTax,
    systemTotalPriceAdjusted,
    loanMonthlyPayment,
    loanTotalPaid,
    totalNewProjectionSelectedPeriod,
  };
} 