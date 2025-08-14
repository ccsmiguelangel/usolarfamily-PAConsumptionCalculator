import { useMemo } from 'react';

export function useProjectionData(loanMonthlyPayment = 0, averageMonthlyCost = 0, selectedRate = 3, loanRateFactor = '6.5', selectedPeriod = 150) {
  // Data for comparison chart - always 25 years (300 months) regardless of selected period
  const comparisonProjectionData = useMemo(() => {
    // Solo necesitamos loanMonthlyPayment para generar la gráfica
    // averageMonthlyCost puede ser 0 (solo batería) o > 0 (con paneles)
    if (loanMonthlyPayment <= 0) return [];
    
    // Always show 25 years (300 months) in the chart
    const totalMonths = 300;
    
    return Array.from({ length: totalMonths }, (_, i) => {
      const month = i + 1;
      
      // Naturgy/Ensa: monthly cost with selected rate (puede ser 0 si no hay consumo)
      const naturgyMonthlyCost = averageMonthlyCost > 0 ? 
        averageMonthlyCost * Math.pow(1 + (selectedRate / 100), Math.floor(i / 12)) : 
        0;
      
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
  }, [loanMonthlyPayment, averageMonthlyCost, selectedRate, selectedPeriod]);

  // Calculate total costs for 25 years (300 months) regardless of selected period
  const totalNaturgyEnsa = useMemo(() => {
    // Si no hay costo mensual, retornar 0 (caso de solo batería)
    if (averageMonthlyCost <= 0) return 0;
    
    let total = 0;
    // Always calculate for 25 years (300 months)
    for (let i = 0; i < 300; i++) {
      const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (selectedRate / 100), Math.floor(i / 12));
      total += naturgyMonthlyCost;
    }
    return total;
  }, [averageMonthlyCost, selectedRate]);

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