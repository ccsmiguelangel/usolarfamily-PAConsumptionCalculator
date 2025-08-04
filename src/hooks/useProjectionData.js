import { useMemo } from 'react';

export function useProjectionData(loanMonthlyPayment, averageMonthlyCost, growthRate, loanRateFactor) {
  // Data for 150-month comparison chart
  const comparisonProjectionData = useMemo(() => {
    if (loanMonthlyPayment <= 0 || averageMonthlyCost <= 0) return [];
    
    const totalMonths = 150;
    
    return Array.from({ length: totalMonths }, (_, i) => {
      const month = i + 1;
      
      // Naturgy/Ensa: monthly cost with annual inflation
      const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (growthRate / 100), Math.floor(i / 12));
      
      // New projection: monthly credit payment (financing for 150 months = 12.5 years)
      let newProjectionMonthlyCost = 0;
      if (month <= 150) {
        // Full payment until month 150 (12.5 years)
        newProjectionMonthlyCost = loanMonthlyPayment;
      }
      
      return {
        month: month,
        naturgy: naturgyMonthlyCost,
        newProjection: newProjectionMonthlyCost
      };
    });
  }, [loanMonthlyPayment, averageMonthlyCost, growthRate]);

  return {
    comparisonProjectionData,
  };
} 