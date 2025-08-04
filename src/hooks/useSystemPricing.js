import { useState, useMemo } from 'react';

export function useSystemPricing(calculatedTotalPanelsWatts) {
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

  // Credit factors
  const loanFactors = {
    '6.5': 0.009755,
    '10.5': 0.011998
  };

  // Monthly credit payment
  const loanMonthlyPayment = useMemo(() => {
    return systemTotalPriceAdjusted * loanFactors[loanRateFactor];
  }, [systemTotalPriceAdjusted, loanRateFactor]);

  // Total paid in credit
  const loanTotalPaid = useMemo(() => {
    return loanMonthlyPayment * 150 / 0.78;
  }, [loanMonthlyPayment]);

  // Total of new projection at 150 months
  const totalNewProjection150Months = useMemo(() => {
    return loanMonthlyPayment * 150;
  }, [loanMonthlyPayment]);

  return {
    systemPriceMultiplier, setSystemPriceMultiplier,
    loanRateFactor, setLoanRateFactor,
    systemTotalPrice,
    systemTotalPriceWithNewTax,
    systemTotalPriceAdjusted,
    loanMonthlyPayment,
    loanTotalPaid,
    totalNewProjection150Months,
  };
} 