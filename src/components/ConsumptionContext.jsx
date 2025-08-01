import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const ConsumptionContext = createContext();

export const ConsumptionProvider = ({ children }) => {
  // const theme = useMantineTheme();
  const [consumptions, setConsumptions] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      month: `Mes ${12 - i}`,
      consumption: '',
      cost: '',
      price: 0,
    }))
  );

  const [selectedRate, setSelectedRate] = useState('4');
  const [averageCost, setAverageCost] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [growthRate, setGrowthRate] = useState('2.99');
  const [panelWatts, setPanelWatts] = useState(''); // Estado para Panel Watts
  const [clientInfo, setClientInfo] = useState({})
  const [quickConsumption, setQuickConsumption] = useState('');
  const [quickCost, setQuickCost] = useState('');
  const [additionalPanels, setAdditionalPanels] = useState(''); // Paneles adicionales o a quitar
  const [totalPanelsWatts, setTotalPanelsWatts] = useState(0);
  const [annualProduction, setAnnualProduction] = useState(0);
  const [coverage, setCoverage] = useState(0);
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
    const panelWattsNum = Number(panelWatts) || 0;
    if (!panelWattsNum || panelWattsNum === 0 || !filledConsumptions) return 0; // Si no hay Panel Watts o faltan meses, no calcular
    return Math.ceil((systemSize * 1000) / panelWattsNum);
  }, [systemSize, panelWatts, filledConsumptions]);

  // Cantidad total de paneles (calculados + adicionales)
  const totalPanelsWithAdjustment = useMemo(() => {
    const additionalPanelsNum = Number(additionalPanels) || 0;
    return numberOfPanels + additionalPanelsNum;
  }, [numberOfPanels, additionalPanels]);

  // Calcular el porcentaje de consumo que cubrirán los paneles
  const consumptionCoveragePercentage = useMemo(() => {
    const panelWattsNum = Number(panelWatts) || 0;
    
    if (!panelWattsNum || panelWattsNum === 0 || !filledConsumptions || totalConsumption === 0) {
      setTotalPanelsWatts(0);
      setAnnualProduction(0);
      setCoverage(0);
      return 0;
    }
    
    // Calcular la potencia total de los paneles en kW
    const calculatedTotalPanelsWatts = totalPanelsWithAdjustment * panelWattsNum / 1000;
    setTotalPanelsWatts(calculatedTotalPanelsWatts);
    
    // Calcular la producción anual estimada en kWh
    // Factor de 4.5 horas de sol promedio por día
    const calculatedAnnualProduction = calculatedTotalPanelsWatts * 4.5 * 365;
    setAnnualProduction(calculatedAnnualProduction);
    
    // Calcular el porcentaje de cobertura
    const calculatedCoverage = (calculatedTotalPanelsWatts / systemSize) * 100;
    setCoverage(calculatedCoverage);
    
    return calculatedCoverage; // Permitir valores mayores a 100%
  }, [totalPanelsWithAdjustment, panelWatts, totalConsumption, filledConsumptions]);



  // Calcular el precio total del sistema aproximado
  const systemTotalPrice = useMemo(() => {
    return totalPanelsWatts > 0 ? totalPanelsWatts * 1000 * 1.4 : 0;
  }, [totalPanelsWatts]);

  // Nuevo estado: multiplicador del precio del sistema
  const [systemPriceMultiplier, setSystemPriceMultiplier] = useState(''); // mínimo -0.4

  // Precio ajustado según el multiplicador
  const systemTotalPriceAdjusted = useMemo(() => {
    const systemPriceMultiplierNum = Number(systemPriceMultiplier) || 0;
    if (systemPriceMultiplierNum >= -0.3 && totalPanelsWatts > 0) {
      return totalPanelsWatts * 1000 * (1.4 + systemPriceMultiplierNum);
    } else {
      return totalPanelsWatts * 1000 * 1.4;
    }
  }, [totalPanelsWatts, systemPriceMultiplier]);

  // Factores de crédito
  const [loanRateFactor, setLoanRateFactor] = useState('6.5'); // '6.5' o '10.5'
  const loanFactors = {
    '6.5': 0.009755,
    '10.5': 0.0119976
  };

  // Pago mensual del crédito
  const loanMonthlyPayment = useMemo(() => {
    return systemTotalPriceAdjusted * loanFactors[loanRateFactor];
  }, [systemTotalPriceAdjusted, loanRateFactor]);

  // Total pagado en el crédito
  const loanTotalPaid = useMemo(() => {
    return loanMonthlyPayment * 150;
  }, [loanMonthlyPayment]);

  // Datos para el gráfico de comparación a 25 años
  const comparisonProjectionData = useMemo(() => {
    if (loanMonthlyPayment <= 0 || averageMonthlyCost <= 0) return [];
    
    const years = 25;
    const months = years * 12;
    
    return Array.from({ length: months }, (_, i) => {
      const year = Math.floor(i / 12) + 1;
      const month = i + 1;
      
      // Naturgy/Ensa: costo mensual con inflación anual
      const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (Number(growthRate) / 100), Math.floor(i / 12));
      
      // Nueva proyección: pago mensual del crédito (financiamiento por 150 meses = 12.5 años)
      let newProjectionMonthlyCost = 0;
      if (month <= 150) {
        // Pago completo hasta mes 150 (12.5 años)
        newProjectionMonthlyCost = loanMonthlyPayment;
      } else if (month <= 156) {
        // Año 13: pago reducido (menos de la mitad porque el financiamiento ya terminó)
        newProjectionMonthlyCost = loanMonthlyPayment * 0.3;
      } else {
        // Después del año 13: sin pago
        newProjectionMonthlyCost = 0;
      }
      
      return {
        year: year,
        month: month,
        naturgy: naturgyMonthlyCost,
        newProjection: newProjectionMonthlyCost
      };
    });
  }, [loanMonthlyPayment, averageMonthlyCost, growthRate]);

  // Función para recalcular el precio del primer mes
  const calculateFirstMonthPrice = (item, field, numericValue) => {
    if (field === 'cost') {
      return (item.consumption > 0) ? numericValue / item.consumption : 0;
    } else if (field === 'consumption') {
      return (item.cost > 0) ? item.cost / numericValue : 0;
    }
    return item.price;
  };

  // Función para recalcular costos de meses 2-12
  const recalculateOtherMonthsCosts = (newData, newPrice) => {
    newData.forEach((item, idx) => {
      if (idx > 0) {
        item.price = newPrice;
        item.cost = item.consumption * newPrice;
      }
    });
  };

  // Función para resetear todos los valores cuando el consumo del primer mes es 0
  const resetAllValuesWhenFirstConsumptionIsZero = (newData) => {
    newData.forEach((item, idx) => {
      item.price = 0;
      if (idx > 0) {
        item.cost = 0;
      }
    });
  };

  // Función para recalcular costo de un mes específico (meses 2-12)
  const recalculateSpecificMonthCost = (item, firstMonthPrice) => {
    return {
      ...item,
      cost: item.consumption * firstMonthPrice,
      price: firstMonthPrice
    };
  };

  // Manejar cambios en los inputs
  const handleInputChange = (id, field, value) => {
    const numericValue = parseFloat(value) || 0;

    const newData = consumptions.map((item, idx) => {
      if (item.id !== id) return item;

      let newItem = { ...item, [field]: numericValue };

      // Solo para meses 2-12, recalcula el costo automáticamente al cambiar el consumo
      if (id > 0 && field === 'consumption') {
        const firstMonthPrice = consumptions[0]?.price || 0;
        newItem = recalculateSpecificMonthCost(newItem, firstMonthPrice);
      }

      // Para el primer mes, recalcula el precio si ambos valores son válidos
      if (id === 0) {
        newItem.price = calculateFirstMonthPrice(item, field, numericValue);
      }

      return newItem;
    });

    // Si cambió el precio del primer mes, recalcular costos de todos los demás meses
    if (id === 0 && (field === 'cost' || field === 'consumption')) {
      const newPrice = newData[0]?.price || 0;
      recalculateOtherMonthsCosts(newData, newPrice);
    }

    // Si el consumo del primer mes es 0, resetear todos los precios y costos a 0
    if (id === 0 && field === 'consumption' && numericValue === 0) {
      resetAllValuesWhenFirstConsumptionIsZero(newData);
    }

    setConsumptions(newData);
  };

  const fillAllMonthsWithQuickValues = () => {
    const newData = consumptions.map((item, index) => {
      if (index === 0) {
        // Para el primer mes, usar el costo y consumo ingresados y calcular precio
        const calculatedPrice = (quickCost > 0 && quickConsumption > 0) ? quickCost / quickConsumption : 0;
        return {
          ...item,
          consumption: quickConsumption,
          cost: quickCost,
          price: calculatedPrice
        };
      } else {
        // Para los meses 2-12, usar el consumo ingresado y el precio del primer mes
        const firstMonthPrice = (quickCost > 0 && quickConsumption > 0) ? quickCost / quickConsumption : 0;
        return {
          ...item,
          consumption: quickConsumption,
          cost: quickConsumption * firstMonthPrice,
          price: firstMonthPrice
        };
      }
    });
    setConsumptions(newData);
  };
  
  const clearAllMonths = () => {
    setConsumptions(consumptions.map(item => ({
      ...item,
      consumption: '',
      cost: '',
      price: 0
    })));
  };

  // Área de un panel solar en m2
  const panelArea = 2.45;

  // Nuevo estado: metros cuadrados del techo
  const [roofSquareMeters, setRoofSquareMeters] = useState(0);

  // Área total ocupada por los paneles calculados
  const totalPanelsArea = useMemo(() => {
    return totalPanelsWithAdjustment * panelArea;
  }, [totalPanelsWithAdjustment]);

  // Máximo de paneles que caben en el techo
  const maxPanelsByRoof = useMemo(() => {
    return roofSquareMeters > 0 ? Math.floor(roofSquareMeters / panelArea) : 0;
  }, [roofSquareMeters]);

  // ¿Caben todos los paneles necesarios?
  const canFitAllPanels = useMemo(() => {
    return totalPanelsWithAdjustment <= maxPanelsByRoof;
  }, [totalPanelsWithAdjustment, maxPanelsByRoof]);

  return (
    <ConsumptionContext.Provider value={{
      // Estados principales
      selectedRate, setSelectedRate,
      consumptions, setConsumptions,
      initialPrice, setInitialPrice,
      growthRate, setGrowthRate,
      panelWatts, setPanelWatts,
      clientInfo, setClientInfo,
      systemPriceMultiplier, setSystemPriceMultiplier,
      roofSquareMeters, setRoofSquareMeters,
      additionalPanels, setAdditionalPanels,
      loanRateFactor, setLoanRateFactor,
      totalPanelsWatts, setTotalPanelsWatts,
      annualProduction, setAnnualProduction,
      coverage, setCoverage,
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
      consumptionCoveragePercentage,
      systemTotalPrice,
      systemTotalPriceAdjusted,
      panelArea,
      totalPanelsArea,
      totalPanelsWithAdjustment,
      maxPanelsByRoof,
      canFitAllPanels,
      loanMonthlyPayment,
      loanTotalPaid,
      comparisonProjectionData,

      quickConsumption, setQuickConsumption,
      quickCost, setQuickCost,
      fillAllMonthsWithQuickValues,
      clearAllMonths,
    }}>
    {children}
    </ConsumptionContext.Provider>
  );
};

export const useConsumption = () => useContext(ConsumptionContext);