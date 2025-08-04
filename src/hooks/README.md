# Custom Hooks - Solar Calculator

This folder contains custom hooks that divide the logic of `ConsumptionContext` into smaller and more manageable components.

## Hook Structure

### 1. `useConsumptionData`
Handles monthly consumption data and basic calculations:
- Consumption state (12 months)
- Average calculations (consumption, price)
- Filling missing consumptions
- Consumption and cost totals

### 2. `useCostCalculations`
Handles calculations related to costs and projections:
- Inflation and growth rates
- 25-year projections
- Chart data for costs
- Naturgy/Ensa totals

### 3. `useSolarPanelCalculations`
Handles all calculations related to solar panels:
- System size
- Number of panels
- Annual production
- System coverage
- Roof space

### 4. `useSystemPricing`
Handles system pricing calculations:
- Base system price
- Price multipliers
- Credit factors
- Monthly payments and totals

### 5. `useConsumptionActions`
Handles actions related to consumption:
- Input changes
- Quick month filling
- Data clearing
- Automatic recalculations

### 6. `useProjectionData`
Handles projection and comparison data:
- Comparison chart data
- 150-month projections

## Usage

```jsx
import { ConsumptionProvider } from '../components/ConsumptionContext';

function App() {
  return (
    <ConsumptionProvider>
      {/* Your components here */}
    </ConsumptionProvider>
  );
}
```

## Advantages of this structure

1. **Separation of concerns**: Each hook handles a specific functionality
2. **Reusability**: Hooks can be used independently
3. **Maintainability**: It's easier to find and modify specific code
4. **Testability**: Each hook can be tested separately
5. **Readability**: Code is easier to understand and navigate

## Migration

To migrate from the original context to the refactored one:

1. Replace imports:
   ```jsx
   // Before
   import { ConsumptionProvider } from './ConsumptionContext';
   
   // After
   import { ConsumptionProvider } from './ConsumptionContext';
   ```

2. The `useConsumption()` hook maintains the same interface, so you don't need to change the components that use it. 