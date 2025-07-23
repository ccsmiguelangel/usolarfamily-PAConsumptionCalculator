import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const ConsumptionContext = createContext();

export const ConsumptionProvider = ({ children }) => {
  // const theme = useMantineTheme();
  const [consumptions, setConsumptions] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      month: `Mes ${i + 1}`,
      consumption: '',
      cost: '',
      price: 0
    }))
  );

  const [selectedRate, setSelectedRate] = useState('4');
  const [averageCost, setAverageCost] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [growthRate, setGrowthRate] = useState('2.99');
  const [panelWatts, setPanelWatts] = useState(0); // Estado para Panel Watts
  const [clientInfo, setClientInfo] = useState({})
  // Calcular promedios
  const averageConsumption = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.consumption) && c.consumption !== '');
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.consumption, 0) / validEntries.length
      : 0;
  }, [consumptions]);

  const averagePrice = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.price) && c.price !== '');
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.price, 0) / validEntries.length
      : 0;
  }, [consumptions]);

  // Rellenar consumos faltantes con el promedio
  const filledConsumptions = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.consumption) && c.consumption !== '');
    const average = validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.consumption, 0) / validEntries.length
      : 0;

    // Rellenar los consumos faltantes con el promedio
    return consumptions.map(c => ({
      ...c,
      consumption: !isNaN(c.consumption) && c.consumption !== '' ? c.consumption : average,
    }));
  }, [consumptions]);

  // Calcular totalConsumption basado en filledConsumptions
  const totalConsumption = useMemo(() => {
    return filledConsumptions.reduce((acc, curr) => acc + curr.consumption, 0);
  }, [filledConsumptions]);

  const totalMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => !isNaN(c.cost) && c.cost !== 0);
    return validEntries.reduce((acc, curr) => acc + curr.cost, 0);
  }, [consumptions]);

  const projectionData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      year: `Año ${i + 1}`,
      value: initialPrice * 12 * Math.pow(1 + (Number(growthRate) / 100), i),
    }));
  }, [initialPrice, growthRate]);

  // Actualizar promedio de costos
  useEffect(() => {
    const validEntries = consumptions.filter(c => c.cost > 0);

    if (validEntries.length === 0) {
      setAverageCost(0);
      return;
    }

    const total = validEntries.reduce((acc, curr) => acc + curr.cost, 0);
    const avg = total / validEntries.length;

    // Forzar actualización si es NaN
    setAverageCost(isNaN(avg) ? 0 : avg);
  }, [consumptions]);


  // Calcular promedio de costos mensuales
  const averageMonthlyCost = useMemo(() => {
    const validEntries = consumptions.filter(c => c.cost > 0);
    return validEntries.length > 0
      ? validEntries.reduce((acc, curr) => acc + curr.cost, 0) / validEntries.length
      : 0;
  }, [consumptions]);

  // Datos para el gráfico
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



  // Calcular el tamaño del sistema
  const systemSize = useMemo(() => {
    if (!filledConsumptions) return 0; // Si faltan meses, no calcular
    return totalConsumption / 1250;
  }, [totalConsumption, filledConsumptions]);

  // Calcular la cantidad de paneles
  const numberOfPanels = useMemo(() => {
    if (!panelWatts || panelWatts === 0 || !filledConsumptions) return 0; // Si no hay Panel Watts o faltan meses, no calcular
    return Math.ceil((systemSize * 1000) / panelWatts);
  }, [systemSize, panelWatts, filledConsumptions]);

  // Manejar cambios en los inputs
  const handleInputChange = (id, field, value) => {
    const numericValue = parseFloat(value) || 0;

    const newData = consumptions.map(item => {
      if (item.id !== id) return item;

      const newItem = {
        ...item,
        [field]: numericValue
      };

      // Calcular costo mensual solo si ambos valores son numéricos
      if (!isNaN(newItem.consumption) && !isNaN(newItem.cost)) {
        newItem.price =  newItem.cost / newItem.consumption;
      } else {
        newItem.price = 0;
      }

      return newItem;
    });

    setConsumptions(newData);
  };

  return (
    <ConsumptionContext.Provider value={{
      // Estados principales
      selectedRate, setSelectedRate,
      consumptions, setConsumptions,
      initialPrice, setInitialPrice,
      growthRate, setGrowthRate,
      panelWatts, setPanelWatts,
      clientInfo, setClientInfo,

      // Funciones
      handleInputChange,

      // Valores calculados
      averageConsumption,
      averagePrice,
      averageCost,
      averageMonthlyCost,
      filledConsumptions,
      totalConsumption,
      totalMonthlyCost,
      projectionData,
      chartData,
      totalNaturgyEnsa,
      totalNewProjection,
      systemSize,
      numberOfPanels,
    }}>
    {children}
    </ConsumptionContext.Provider>
  );
};

export const useConsumption = () => useContext(ConsumptionContext);