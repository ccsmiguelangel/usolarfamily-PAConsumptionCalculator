import { useState } from 'react';

export function useConsumptionActions(consumptions, setConsumptions) {
  const [quickConsumption, setQuickConsumption] = useState('');
  const [quickCost, setQuickCost] = useState('');

  // Function to recalculate first month price
  const calculateFirstMonthPrice = (item, field, numericValue) => {
    if (field === 'cost') {
      return (item.consumption > 0) ? numericValue / item.consumption : 0;
    } else if (field === 'consumption') {
      return (item.cost > 0) ? item.cost / numericValue : 0;
    }
    return item.price;
  };

  // Function to recalculate costs for months 2-12
  const recalculateOtherMonthsCosts = (newData, newPrice) => {
    newData.forEach((item, idx) => {
      if (idx > 0) {
        item.price = newPrice;
        item.cost = item.consumption * newPrice;
      }
    });
  };

  // Function to reset all values when first month consumption is 0
  const resetAllValuesWhenFirstConsumptionIsZero = (newData) => {
    newData.forEach((item, idx) => {
      item.price = 0;
      if (idx > 0) {
        item.cost = 0;
      }
    });
  };

  // Function to recalculate cost for a specific month (months 2-12)
  const recalculateSpecificMonthCost = (item, firstMonthPrice) => {
    return {
      ...item,
      cost: item.consumption * firstMonthPrice,
      price: firstMonthPrice
    };
  };

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    const numericValue = parseFloat(value) || 0;

    const newData = consumptions.map((item, idx) => {
      if (item.id !== id) return item;

      let newItem = { ...item, [field]: numericValue };

      // Only for months 2-12, recalculate cost automatically when changing consumption
      if (id > 0 && field === 'consumption') {
        const firstMonthPrice = consumptions[0]?.price || 0;
        newItem = recalculateSpecificMonthCost(newItem, firstMonthPrice);
      }

      // For first month, recalculate price if both values are valid
      if (id === 0) {
        newItem.price = calculateFirstMonthPrice(item, field, numericValue);
      }

      return newItem;
    });

    // If first month price changed, recalculate costs for all other months
    if (id === 0 && (field === 'cost' || field === 'consumption')) {
      const newPrice = newData[0]?.price || 0;
      recalculateOtherMonthsCosts(newData, newPrice);
    }

    // If first month consumption is 0, reset all prices and costs to 0
    if (id === 0 && field === 'consumption' && numericValue === 0) {
      resetAllValuesWhenFirstConsumptionIsZero(newData);
    }

    setConsumptions(newData);
  };

  const fillAllMonthsWithQuickValues = () => {
    const newData = consumptions.map((item, index) => {
      if (index === 0) {
        // For first month, use entered cost and consumption and calculate price
        const calculatedPrice = (quickCost > 0 && quickConsumption > 0) ? quickCost / quickConsumption : 0;
        return {
          ...item,
          consumption: quickConsumption,
          cost: quickCost,
          price: calculatedPrice
        };
      } else {
        // For months 2-12, use entered consumption and first month price
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

  return {
    quickConsumption, setQuickConsumption,
    quickCost, setQuickCost,
    handleInputChange,
    fillAllMonthsWithQuickValues,
    clearAllMonths,
  };
} 