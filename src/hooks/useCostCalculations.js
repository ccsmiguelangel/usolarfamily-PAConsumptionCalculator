import { useState, useMemo, useEffect } from 'react';

export function useCostCalculations(consumptions) {
  const [selectedRate, setSelectedRate] = useState(3);
  const [averageCost, setAverageCost] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [inflationRate, setInflationRate] = useState(3);
  const [growthRate, setGrowthRate] = useState(3);

  // Calculate average monthly costs
  const averageMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => c.cost !== '' && !isNaN(Number(c.cost)) && Number(c.cost) > 0);
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + Number(curr.cost), 0) / validEntries.length
      : 0;
  }, [consumptions]);

  // Update average costs
  useEffect(() => {
    const validEntries = consumptions.filter(c => c.cost !== '' && !isNaN(Number(c.cost)) && Number(c.cost) > 0);

    if (validEntries.length === 0) {
      setAverageCost(0);
      return;
    }

    const total = validEntries.reduce((acc, curr) => acc + Number(curr.cost), 0);
    const avg = total / validEntries.length;

    setAverageCost(isNaN(avg) ? 0 : avg);
  }, [consumptions]);

  const projectionData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      year: `Año ${i + 1}`,
      value: initialPrice * 12 * Math.pow(1 + (growthRate / 100), i),
    }));
  }, [initialPrice, growthRate]);

  // Data for chart
  const chartData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      year: `Año ${i + 1}`,
      value: averageMonthlyCost * 12 * Math.pow(1 + (selectedRate / 100), i)
    }));
  }, [averageMonthlyCost, selectedRate]);

  const totalNaturgyEnsa = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const totalNewProjection = useMemo(() => {
    return projectionData.reduce((acc, curr) => acc + curr.value, 0);
  }, [projectionData]);

  // Totals for 300 months
  const totalNaturgyEnsa300Months = useMemo(() => {
    if (averageMonthlyCost <= 0) return 0;
    let total = 0;
    for (let i = 0; i < 300; i++) {
      const monthlyCost = averageMonthlyCost * Math.pow(1 + (inflationRate / 100), Math.floor(i / 12));
      total += monthlyCost;
    }
    return total;
  }, [averageMonthlyCost, inflationRate]);

  return {
    selectedRate, setSelectedRate,
    averageCost, setAverageCost,
    initialPrice, setInitialPrice,
    inflationRate, setInflationRate,
    averageMonthlyCost,
    projectionData,
    chartData,
    totalNaturgyEnsa,
    totalNewProjection,
    totalNaturgyEnsa300Months,
  };
} 