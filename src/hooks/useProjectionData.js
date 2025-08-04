import { useMemo } from 'react';

export function useProjectionData(loanMonthlyPayment = 0, averageMonthlyCost = 0, growthRate = 4, loanRateFactor = '6.5', selectedPeriod = 150, inflationRate = 4) {
  // Data for comparison chart based on selected period
  const comparisonProjectionData = useMemo(() => {
    if (loanMonthlyPayment <= 0 || averageMonthlyCost <= 0) return [];
    
    const totalMonths = selectedPeriod;
    
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
      
      return {
        month: month,
        naturgy: naturgyMonthlyCost,
        newProjection: newProjectionMonthlyCost
      };
    });
  }, [loanMonthlyPayment, averageMonthlyCost, inflationRate, selectedPeriod]);

  // Calculate total costs for the selected period
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