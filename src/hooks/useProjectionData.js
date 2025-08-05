import { useMemo } from 'react';

export function useProjectionData(loanMonthlyPayment = 0, averageMonthlyCost = 0, growthRate = 3, loanRateFactor = '6.5', selectedPeriod = 150, inflationRate = 3) {
  // Data for comparison chart - always 25 years (300 months) regardless of selected period
  const comparisonProjectionData = useMemo(() => {
    if (loanMonthlyPayment <= 0 || averageMonthlyCost <= 0) return [];
    
    // Always show 25 years (300 months) in the chart
    const totalMonths = 300;
    
    return Array.from({ length: totalMonths }, (_, i) => {
      const month = i + 1;
      
      // Naturgy/Ensa: monthly cost with selected inflation rate
      const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (inflationRate / 100), Math.floor(i / 12));
      
      // New projection: monthly credit payment (financing for the selected period)
      let newProjectionMonthlyCost = 0;
      if (month <= selectedPeriod) {
        // Full payment until the selected period
        newProjectionMonthlyCost = loanMonthlyPayment;
      }
      // After selected period, no more payments (system is paid off)
      
      return {
        month: month,
        naturgy: naturgyMonthlyCost,
        newProjection: newProjectionMonthlyCost
      };
    });
  }, [loanMonthlyPayment, averageMonthlyCost, inflationRate, selectedPeriod]);

  // Calculate total costs for the selected period (for summary calculations)
  const totalNaturgyEnsa = useMemo(() => {
    if (averageMonthlyCost <= 0) return 0;
    
    let total = 0;
    for (let i = 0; i < selectedPeriod; i++) {
      const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (inflationRate / 100), Math.floor(i / 12));
      total += naturgyMonthlyCost;
    }
    return total;
  }, [averageMonthlyCost, inflationRate, selectedPeriod]);

  const totalNewProjection = useMemo(() => {
    if (loanMonthlyPayment <= 0) return 0;
    return loanMonthlyPayment * selectedPeriod;
  }, [loanMonthlyPayment, selectedPeriod]);

  return {
    comparisonProjectionData,
    totalNaturgyEnsa: totalNaturgyEnsa || 0,
    totalNewProjection: totalNewProjection || 0,
  };
} 