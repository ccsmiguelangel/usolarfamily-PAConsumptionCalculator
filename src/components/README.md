# Solar Calculator Components

## 🏗️ Component Architecture

### Dependency Structure
```
ConsumptionContext (Global State)
    ↓
├── NewProjectionChart (Main Chart)
├── PaymentSummary (Savings Summary)
├── SolarPanelCalculator (System Configuration)
├── ConsumptionTableInputs (Data Input)
└── Other Components
```

## 🔑 Main Components

### 1. ConsumptionContext.jsx
**Purpose**: Global state and coordination between all hooks and components.

**Key Features**:
- Robust error handling with try-catch
- Default values for all variables
- Coordination between specialized hooks
- Conditional logic for active/inactive battery

**Critical Variables**:
```javascript
// Battery state
const { batteryPrice, wantsBattery } = batterySystem;

// Projection data
const projectionData = useProjectionData(..., inflationRate, ...);
const projectionDataWithBattery = useProjectionData(..., inflationRate, ...);

// Chart conditional logic
comparisonProjectionData: batterySystem?.wantsBattery ? 
  projectionDataWithBattery?.comparisonProjectionData || [] : 
  projectionData?.comparisonProjectionData || []
```

### 2. NewProjectionChart.jsx
**Purpose**: Main 25-year comparison chart and estimated monthly payment.

**Price Logic**:
```javascript
// Total price: WITHOUT taxes (transparency)
const displayTotalPrice = wantsBattery ? 
  (systemTotalPriceAdjusted + batteryPrice) : 
  (systemTotalPriceAdjusted || systemTotalPrice);

// Monthly payment: WITH taxes (financial calculations)
const displayMonthlyPayment = wantsBattery ? 
  loanMonthlyPaymentWithBattery : 
  loanMonthlyPayment;
```

**Required Variables**:
```javascript
const {
  loanMonthlyPayment,           // Monthly payment with taxes
  loanMonthlyPaymentWithBattery, // Monthly payment with battery and taxes
  systemTotalPrice,             // Base price without taxes
  systemTotalPriceAdjusted,     // Adjusted price without taxes
  batteryPrice,                 // Battery price
  wantsBattery,                 // Battery state
  // ... other variables
} = useConsumption();
```

### 3. PaymentSummary.jsx
**Purpose**: Summary table showing totals and savings.

**Savings Calculation**:
```javascript
// Use price WITHOUT taxes to show real savings
const totalSystemPrice = wantsBattery ? 
  (systemTotalPriceAdjusted + batteryPrice) : 
  (systemTotalPriceAdjusted || systemTotalPrice);

// Total saved = Naturgy - System price
const savings = totalNaturgyEnsaToShow - totalSystemPrice;
```

### 4. SolarPanelCalculator.jsx
**Purpose**: Solar system and battery configuration.

**Battery System**:
- Toggle to activate/deactivate
- Capacity selection
- Automatic calculation of total prices
- Suggested capacity validation

## 🚨 Critical Rules to Follow

### 1. Price Management
- **NEVER** show prices with taxes in the main interface
- **ALWAYS** use prices with taxes for financial calculations
- **MAINTAIN** consistency between chart and displayed values

### 2. Battery Logic
```javascript
// ✅ CORRECT - Use complete object
comparisonProjectionData: batterySystem?.wantsBattery ? ... : ...

// ❌ INCORRECT - Undefined variable
comparisonProjectionData: wantsBattery ? ... : ...
```

### 3. Inflation Rate
```javascript
// ✅ CORRECT - Use inflationRate for projections
useProjectionData(..., inflationRate, ...)

// ❌ INCORRECT - Use selectedRate for projections
useProjectionData(..., selectedRate, ...)
```

### 4. Analysis Periods
- **Naturgy/Ensa**: Always 300 months (25 years)
- **Solar System**: Selected credit period
- **Independence**: Naturgy spending doesn't depend on credit period

## 🔧 Debugging and Maintenance

### State Verification
1. **ConsumptionContext**: Confirm try-catch and default values
2. **Battery Variables**: Verify `wantsBattery` and `batteryPrice`
3. **Inflation Rate**: Confirm use of `inflationRate`
4. **Conditional Logic**: Verify `comparisonProjectionData`

### Functionality Testing
1. **Battery Toggle**: Activate/deactivate and verify changes
2. **Period Change**: Modify credit and verify consistency
3. **Inflation Rate**: Change scenario and verify chart
4. **Prices**: Confirm that total price and monthly payment are aligned

### Common Errors
- `ReferenceError: wantsBattery is not defined`
- `ReferenceError: loanMonthlyPayment is not defined`
- Chart doesn't change when activating battery
- Inflation rate doesn't affect projections

## 📊 Data Flow

### Without Battery
```
projectionData → comparisonProjectionData → Chart
Price without taxes → Interface
Monthly payment with taxes → Financial calculations
```

### With Battery
```
projectionDataWithBattery → comparisonProjectionData → Chart
Price + battery without taxes → Interface
Monthly payment + battery with taxes → Financial calculations
```

## 🎯 Benefits of this Implementation

1. **Transparency**: Client sees real price without taxes
2. **Accuracy**: Financial calculations with correct taxes
3. **Consistency**: Chart and values always aligned
4. **Flexibility**: Easy change between scenarios
5. **Robustness**: Error handling and default values

---

**Note**: This README must be kept updated with any changes in architecture or business logic.
