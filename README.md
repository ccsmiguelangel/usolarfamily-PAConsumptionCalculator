# Solar Calculator - Energy Calculation System

## 🎯 General Description

Solar panel calculation system that allows users to estimate costs, savings, and financial projections over 25 years for residential solar energy systems.

## 🏗️ System Architecture

### Folder Structure
```
src/
├── components/          # Main React components
├── hooks/              # Custom hooks for business logic
└── assets/             # Static resources
```

### Main Data Flow
```
ConsumptionContext (Global State)
    ↓
Specialized Hooks
    ↓
UI Components
```

## 🔑 Key Architecture Decisions

### 1. Separation of Responsibilities
- **ConsumptionContext**: Global state and coordination between hooks
- **Hooks**: Specific business logic (calculations, projections, pricing)
- **Components**: Only presentation and user interaction

### 2. State Management with Try-Catch
- Implemented robust error handling in the main context
- Default values for all variables in case of failure
- Prevention of application crashes

### 3. Dual Financial Calculations
- **System price**: Always without taxes (transparency for the client)
- **Monthly payments**: With taxes (precise financial calculations)
- **Charts**: Aligned with displayed monthly payments

## 📊 Pricing System

### Price Structure
```
systemTotalPrice (without taxes)
    ↓
systemTotalPriceWithNewTax (with taxes)
    ↓
loanMonthlyPayment (monthly payment with taxes)
```

### Key Variables
- `systemTotalPrice`: Base system price
- `systemTotalPriceAdjusted`: Price adjusted by multiplier
- `systemTotalPriceWithNewTax`: Price with taxes (for financial calculations)
- `batteryPrice`: Battery price (when active)

## 🔋 Battery System

### Activation Logic
- `wantsBattery`: Toggle to activate/deactivate battery
- `batteryPrice`: Selected battery price
- Automatic calculations of total prices with and without battery

### Chart Behavior
- **Without battery**: Uses `projectionData` (payments without battery)
- **With battery**: Uses `projectionDataWithBattery` (payments with battery)
- `comparisonProjectionData` changes dynamically based on state

## 📈 Financial Projections

### Analysis Period
- **Always 25 years (300 months)** for Naturgy/Ensa
- **Variable credit period** for solar system payments
- **Independence**: Naturgy/Ensa spending doesn't depend on credit period

### Total Calculations
```javascript
// Naturgy/Ensa: Always 300 months
totalNaturgyEnsa = sum(300 months with inflation)

// Solar System: Credit period
totalNewProjection = loanMonthlyPayment × selectedPeriod
```

## 🎛️ Inflation Selector

### Inflation Rate
- **Variable**: `inflationRate` (not `selectedRate`)
- **Range**: 2% to 6% annually
- **Affects**: Naturgy/Ensa chart and total spent
- **Doesn't affect**: Solar system payments (fixed credit rate)

### Implementation
```javascript
// ✅ CORRECT - Use inflationRate
projectionData = useProjectionData(..., inflationRate, ...)

// ❌ INCORRECT - Don't use selectedRate
projectionData = useProjectionData(..., selectedRate, ...)
```

## 🚨 Common Errors to Avoid

### 1. Variable References
```javascript
// ❌ INCORRECT - Undefined variable
comparisonProjectionData: wantsBattery ? ... : ...

// ✅ CORRECT - Use complete object
comparisonProjectionData: batterySystem?.wantsBattery ? ... : ...
```

### 2. Variable Duplication
```javascript
// ❌ INCORRECT - Duplicate variables already included in spread
...systemPricing,
loanMonthlyPayment: loanMonthlyPayment,  // Already included in systemPricing

// ✅ CORRECT - Only use spread
...systemPricing
```

### 3. Inflation Rate Usage
```javascript
// ❌ INCORRECT - Use selectedRate for projections
useProjectionData(..., selectedRate, ...)

// ✅ CORRECT - Use inflationRate for projections
useProjectionData(..., inflationRate, ...)
```

## 🔧 Maintenance and Debugging

### State Verification
1. Check that `ConsumptionContext` has try-catch
2. Verify that all hooks have default values
3. Confirm that `comparisonProjectionData` uses correct conditional logic

### Functionality Testing
1. Activate/deactivate battery
2. Change credit period
3. Modify inflation rate
4. Verify consistency between chart and displayed values

## 📝 Implementation Notes

### Critical Hooks
- `useSystemPricing`: Price and monthly payment calculations
- `useProjectionData`: 25-year projections
- `useBatterySystem`: Battery system management

### Key Components
- `NewProjectionChart`: Main chart and monthly payment
- `PaymentSummary`: Savings summary
- `SolarPanelCalculator`: System configuration

## 🎉 Benefits of this Architecture

1. **Maintainability**: Separated and well-documented logic
2. **Robustness**: Error handling and default values
3. **Consistency**: Synchronized data between components
4. **Flexibility**: Easy modification of rates and periods
5. **Transparency**: Prices without taxes for the client

---

**Last updated**: December 2024  
**Developed by**: AI Assistant  
**Version**: 1.0.0
