import { useState, useMemo } from 'react';

export function useBatterySystem(systemSize) {
  // Configuración de baterías Pytes - fácilmente modificable por developers
  const BATTERY_CONFIG = {
    baseCapacity: 10, // Capacidad base en kW
    capacityIncrement: 5, // Incremento por paso en kW
    minCapacity: 10, // Capacidad mínima
    maxCapacity: 40, // Capacidad máxima ajustada a 40kW
    // Precios específicos por capacidad en USD
    capacityPrices: {
      10: 6999,   // 10kW - $6,999
      15: 9699,   // 15kW - $9,699
      20: 12599,  // 20kW - $12,599
      // 25: 15399,  // 25kW - $15,999 (precio razonable intermedio)
      30: 19399,  // 30kW - $18,999 (precio razonable intermedio)
      // 35: 21999,  // 35kW - $21,999 (precio razonable intermedio)
      40: 25199   // 40kW - $25,199 (como dos de 20kW)
    }
  };

  const [wantsBattery, setWantsBattery] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState(10);

  // Calcular batería sugerida automáticamente según el tamaño del sistema
  const suggestedCapacity = useMemo(() => {
    if (!systemSize || systemSize <= 0) return 10;
    
    // Cada 3kW de sistema solar = 5kW de batería sugerida
    const suggestedBatterySize = Math.ceil(systemSize / 3) * 5;
    
    // Obtener capacidades disponibles (con precios válidos)
    const availableCapacities = Object.keys(BATTERY_CONFIG.capacityPrices)
      .map(Number)
      .filter(capacity => BATTERY_CONFIG.capacityPrices[capacity] > 0)
      .sort((a, b) => a - b);
    
    if (availableCapacities.length === 0) return 10; // Fallback
    
    // Encontrar la capacidad más cercana a la sugerida
    let closestCapacity = availableCapacities[0];
    let minDifference = Math.abs(suggestedBatterySize - closestCapacity);
    
    for (const capacity of availableCapacities) {
      const difference = Math.abs(suggestedBatterySize - capacity);
      if (difference < minDifference) {
        minDifference = difference;
        closestCapacity = capacity;
      }
    }
    
    return closestCapacity;
  }, [systemSize]);

  // Calcular precio de la batería basado en la capacidad
  const batteryPrice = useMemo(() => {
    if (!wantsBattery) return 0;
    
    return BATTERY_CONFIG.capacityPrices[selectedCapacity] || 0;
  }, [wantsBattery, selectedCapacity]);

  // Validar que la capacidad sea válida y tenga precio
  const isValidCapacity = useMemo(() => {
    if (!wantsBattery) return true;
    
    // Verificar que la capacidad tenga un precio válido
    const price = BATTERY_CONFIG.capacityPrices[selectedCapacity];
    return price && price > 0;
  }, [wantsBattery, selectedCapacity]);

  // Obtener opciones válidas de batería para el selector
  const batteryOptions = useMemo(() => {
    const options = [];
    for (let capacity = BATTERY_CONFIG.minCapacity; 
         capacity <= BATTERY_CONFIG.maxCapacity; 
         capacity += BATTERY_CONFIG.capacityIncrement) {
      const price = BATTERY_CONFIG.capacityPrices[capacity];
      // Solo incluir capacidades que tienen precios definidos
      if (price && price > 0) {
        options.push({
          value: capacity.toString(),
          label: `${capacity} kW - $${price.toLocaleString()}`,
          price: price
        });
      }
    }
    return options;
  }, []);

  // Actualizar capacidad seleccionada cuando cambia la sugerencia
  const updateSelectedCapacityToSuggested = () => {
    setSelectedCapacity(suggestedCapacity);
  };

  // Resetear estado de batería
  const resetBatterySelection = () => {
    setWantsBattery(false);
    setSelectedCapacity(10);
  };

  return {
    // Estados
    wantsBattery,
    setWantsBattery,
    selectedCapacity: selectedCapacity || 10,
    setSelectedCapacity,
    
    // Cálculos
    batteryPrice,
    suggestedCapacity,
    isValidCapacity,
    batteryOptions,
    
    // Configuración (para debugging/modificación)
    BATTERY_CONFIG,
    
    // Acciones
    updateSelectedCapacityToSuggested,
    resetBatterySelection,
  };
}
