import { useState, useMemo } from 'react';

export function useConsumptionData() {
  const [consumptions, setConsumptions] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      month: `Mes ${12 - i}`,
      consumption: '',
      cost: '',
      price: 0,
    }))
  );

  // Calculate averages
  const averageConsumption = useMemo(() => {
    const validEntries = consumptions.filter(c => c.consumption !== '' && !isNaN(Number(c.consumption)) && Number(c.consumption) > 0);
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + Number(curr.consumption), 0) / validEntries.length
      : 0;
  }, [consumptions]);

  const averagePrice = useMemo(() => {
    const validEntries = consumptions.filter(c => c.price !== '' && !isNaN(Number(c.price)) && Number(c.price) > 0);
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + Number(curr.price), 0) / validEntries.length
      : 0;
  }, [consumptions]);

  // Fill missing consumptions with average
  const filledConsumptions = useMemo(() => {
    const validEntries = consumptions.filter(c => c.consumption !== '' && !isNaN(Number(c.consumption)) && Number(c.consumption) > 0);
    const average = validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + Number(curr.consumption), 0) / validEntries.length
      : 0;

    return consumptions.map(c => ({
      ...c,
      consumption: (c.consumption !== '' && !isNaN(Number(c.consumption)) && Number(c.consumption) > 0) ? Number(c.consumption) : average,
    }));
  }, [consumptions]);

  // Calculate totalConsumption based on filledConsumptions
  const totalConsumption = useMemo(() => {
    return filledConsumptions.reduce((acc, curr) => acc + curr.consumption, 0);
  }, [filledConsumptions]);

  const totalMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => c.cost !== '' && !isNaN(Number(c.cost)) && Number(c.cost) > 0);
    return validEntries.reduce((acc, curr) => acc + Number(curr.cost), 0);
  }, [consumptions]);

  return {
    consumptions,
    setConsumptions,
    averageConsumption,
    averagePrice,
    filledConsumptions,
    totalConsumption,
    totalMonthlyCost,
  };
} 