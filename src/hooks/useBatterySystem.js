import { useState, useMemo } from 'react';

export function useBatterySystem(systemSize) {
  // Configuración de baterías Pytes - fácilmente modificable por developers
  const BATTERY_CONFIG = {
    baseCapacity: 10, // Capacidad base en kW
    capacityIncrement: 5, // Incremento por paso en kW
    basePrice: 12500, // Precio base en USD
    priceIncrement: 8000, // Incremento de precio por paso en USD
    minCapacity: 10, // Capacidad mínima
    maxCapacity: 100, // Capacidad máxima (ajustable)
  };

  const [wantsBattery, setWantsBattery] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState(10);

  // Calcular batería sugerida automáticamente según el tamaño del sistema
  const suggestedCapacity = useMemo(() => {
    if (systemSize <= 3.0) return 10;
    if (systemSize <= 6.0) return 15;
    return 20;
  }, [systemSize]);

  // Calcular precio de la batería basado en la capacidad
  const batteryPrice = useMemo(() => {
    if (!wantsBattery) return 0;
    
    const steps = (selectedCapacity - BATTERY_CONFIG.baseCapacity) / BATTERY_CONFIG.capacityIncrement;
    return BATTERY_CONFIG.basePrice + (steps * BATTERY_CONFIG.priceIncrement);
  }, [wantsBattery, selectedCapacity]);

  // Validar que la capacidad sea un múltiplo válido
  const isValidCapacity = useMemo(() => {
    if (!wantsBattery) return true;
    
    const remainder = (selectedCapacity - BATTERY_CONFIG.baseCapacity) % BATTERY_CONFIG.capacityIncrement;
    return remainder === 0 && 
           selectedCapacity >= BATTERY_CONFIG.baseCapacity && 
           selectedCapacity <= BATTERY_CONFIG.maxCapacity;
  }, [wantsBattery, selectedCapacity]);

  // Obtener opciones válidas de batería para el selector
  const batteryOptions = useMemo(() => {
    const options = [];
    for (let capacity = BATTERY_CONFIG.baseCapacity; 
         capacity <= BATTERY_CONFIG.maxCapacity; 
         capacity += BATTERY_CONFIG.capacityIncrement) {
      const price = BATTERY_CONFIG.basePrice + 
                   ((capacity - BATTERY_CONFIG.baseCapacity) / BATTERY_CONFIG.capacityIncrement) * 
                   BATTERY_CONFIG.priceIncrement;
      options.push({
        value: capacity.toString(),
        label: `${capacity} kW - $${price.toLocaleString()}`,
        price: price
      });
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
