# Solar Calculator Hooks

## 🏗️ Hook Architecture

### Dependency Structure
```
useConsumptionData → useCostCalculations → useProjectionData
useSolarPanelCalculations → useSystemPricing → useProjectionData
useBatterySystem → useSystemPricing → useProjectionData
```

## 🔑 Main Hooks

### 1. useSystemPricing.js
**Purpose**: System pricing and monthly payment calculations.

**Output Variables**:
```javascript
return {
  // Base prices (without taxes)
  systemTotalPrice,                    // Base system price
  systemTotalPriceAdjusted,            // Price adjusted by multiplier
  
  // Prices with taxes (for financial calculations)
  systemTotalPriceWithNewTax,          // Price with taxes
  systemTotalPriceWithNewTaxWithBattery, // Price with battery and taxes
  
  // Monthly payments (with taxes)
  loanMonthlyPayment,                  // Base monthly payment
  loanMonthlyPaymentWithBattery,       // Monthly payment with battery
  loanMonthlyPaymentForComparison,     // Monthly payment for comparison
  
  // Monthly payments (without taxes) - for display
  loanMonthlyPaymentWithoutTax,        // Monthly payment without taxes
  loanMonthlyPaymentWithBatteryWithoutTax, // Monthly payment with battery without taxes
}
```

**Calculation Logic**:
```javascript
// Base price per watt
const defaultPricePerWatt = 1.1;

// Total system price
const systemTotalPrice = calculatedTotalPanelsWatts * 1000 * defaultPricePerWatt;

// Price adjusted by multiplier
const systemTotalPriceAdjusted = calculatedTotalPanelsWatts * 1000 * (defaultPricePerWatt + systemPriceMultiplier);

// Price with taxes (for financial calculations)
const systemTotalPriceWithNewTax = systemTotalPriceAdjusted / 0.78;

// Loan factor
const loanFactor = calculateLoanFactor(annualRate, months);

// Monthly payment
const loanMonthlyPayment = systemTotalPriceWithNewTax * loanFactor;
```

### 2. useProjectionData.js
**Purpose**: Generation of 25-year projection data.

**Input Parameters**:
```javascript
useProjectionData(
  loanMonthlyPayment,    // Monthly credit payment
  averageMonthlyCost,    // Average monthly energy cost
  inflationRate,         // Annual inflation rate (NOT selectedRate)
  loanRateFactor,        // Credit rate factor
  selectedPeriod         // Credit period in months
)
```

**Calculation Logic**:
```javascript
// Naturgy/Ensa: Always 300 months (25 years)
const totalNaturgyEnsa = useMemo(() => {
  if (averageMonthlyCost <= 0) return 0;
  
  let total = 0;
  // Always calculate for 25 years (300 months)
  for (let i = 0; i < 300; i++) {
    const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (inflationRate / 100), Math.floor(i / 12));
    total += naturgyMonthlyCost;
  }
  return total;
}, [averageMonthlyCost, inflationRate]); // DO NOT include selectedPeriod

// Solar System: Only credit period
const totalNewProjection = loanMonthlyPayment * selectedPeriod;
```

**Chart Data**:
```javascript
// Always 300 months for the chart
const totalMonths = 300;

return Array.from({ length: totalMonths }, (_, i) => {
  const month = i + 1;
  
  // Naturgy/Ensa: Monthly cost with inflation
  const naturgyMonthlyCost = averageMonthlyCost * Math.pow(1 + (inflationRate / 100), Math.floor(i / 12));
  
  // Solar System: Monthly payment only during credit period
  let newProjectionMonthlyCost = 0;
  if (month <= selectedPeriod) {
    newProjectionMonthlyCost = loanMonthlyPayment;
  }
  // After credit period: $0 (system paid off)
  
  return { month, naturgy: naturgyMonthlyCost, newProjection: newProjectionMonthlyCost };
});
```

### 3. useCostCalculations.js
**Purpose**: Cost calculations and inflation rates.

**Critical Variables**:
```javascript
const [selectedRate, setSelectedRate] = useState(3);      // ❌ DON'T use for projections
const [inflationRate, setInflationRate] = useState(3);   // ✅ USE for projections
```

**Correct Usage**:
```javascript
// ✅ CORRECT - For Naturgy/Ensa projections
const chartData = useMemo(() => {
  return Array.from({ length: 25 }, (_, i) => ({
    year: `Year ${i + 1}`,
    value: averageMonthlyCost * 12 * Math.pow(1 + (inflationRate / 100), i)
  }));
}, [averageMonthlyCost, inflationRate]);

// ❌ INCORRECT - Don't use selectedRate for projections
const chartData = useMemo(() => {
  return Array.from({ length: 25 }, (_, i) => ({
    year: `Year ${i + 1}`,
    value: averageMonthlyCost * 12 * Math.pow(1 + (selectedRate / 100), i)
  }));
}, [averageMonthlyCost, selectedRate]);
```

### 4. useBatterySystem.js
**Purpose**: Battery system management.

**Output Variables**:
```javascript
return {
  wantsBattery,          // Battery toggle state
  batteryPrice,          // Selected battery price
  selectedCapacity,      // Selected capacity
  suggestedCapacity,     // Suggested capacity based on system
  isValidCapacity,       // Capacity validation
  batteryOptions,        // Available options
}
```

## 🚨 Critical Rules

### 1. Inflation Rate
- **ALWAYS** use `inflationRate` for Naturgy/Ensa projections
- **NEVER** use `selectedRate` for projections
- **Verify** that `inflationRate` is passed to `useProjectionData`

### 2. Analysis Periods
- **Naturgy/Ensa**: Always 300 months (25 years)
- **Solar System**: Only during credit period
- **Independence**: Naturgy spending should not depend on credit period

### 3. Prices and Payments
- **System prices**: Without taxes for interface
- **Monthly payments**: With taxes for financial calculations
- **Consistency**: Maintain alignment between hooks

### 4. Error Handling
- **Default values**: All hooks must have default values
- **Validation**: Verify that input parameters are valid
- **Fallbacks**: Provide alternatives in case of error

## 🔧 New Hook Implementation

### Recommended Structure
```javascript
export function useNewHook(param1, param2) {
  // 1. Parameter validation
  if (!param1 || !param2) {
    return { defaultValue: 0 };
  }

  // 2. Main calculations
  const result = useMemo(() => {
    // Hook logic
    return calculatedValue;
  }, [param1, param2]);

  // 3. Default values
  return {
    result: result || 0,
    defaultValue: 0,
    // ... other values
  };
}
```

### Integration with ConsumptionContext
```javascript
// In ConsumptionContext.jsx
const newHookData = useNewHook(param1, param2);
const { result = 0, defaultValue = 0 } = newHookData || {};

// Include in context
return (
  <ConsumptionContext.Provider value={{
    ...newHookData,
    // ... other values
  }}>
    {children}
  </ConsumptionContext.Provider>
);
```

## 📊 Hook Testing

### Functionality Verification
1. **Valid parameters**: Test with normal values
2. **Invalid parameters**: Test with null/undefined values
3. **Default values**: Verify that safe values are returned
4. **Dependencies**: Confirm that useMemo has correct dependencies

### Test Cases
```javascript
// Case 1: Valid parameters
const result = useProjectionData(100, 50, 3, '6.5', 150);
expect(result.totalNaturgyEnsa).toBeGreaterThan(0);

// Case 2: Invalid parameters
const result = useProjectionData(0, 0, 0, '6.5', 0);
expect(result.totalNaturgyEnsa).toBe(0);

// Case 3: Inflation change
const result1 = useProjectionData(100, 50, 2, '6.5', 150);
const result2 = useProjectionData(100, 50, 6, '6.5', 150);
expect(result2.totalNaturgyEnsa).toBeGreaterThan(result1.totalNaturgyEnsa);
```

---

**Note**: This README must be kept updated with any changes in business logic or new hook implementation. 