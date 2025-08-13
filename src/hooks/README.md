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

## Technical Implementation

Each hook is designed to be independent and can be imported and used separately:

```jsx
import { useConsumptionData } from '../hooks/useConsumptionData';
import { useSolarPanelCalculations } from '../hooks/useSolarPanelCalculations';

function MyComponent() {
  const { consumptionData, averages } = useConsumptionData();
  const { systemSize, panelCount } = useSolarPanelCalculations();
  
  // Use the data...
}
```

## File Structure

```
hooks/
├── index.js                    # Main exports
├── useConsumptionData.js       # Consumption data
├── useCostCalculations.js      # Cost calculations
├── useSolarPanelCalculations.js # Solar panel calculations
├── useSystemPricing.js         # System pricing
├── useConsumptionActions.js    # Consumption actions
├── useProjectionData.js        # Projection data
└── README.md                   # This file
```

## Development Notes

- All hooks are optimized for React 18+
- Use context pattern for state sharing
- Implement memoization to avoid unnecessary recalculations
- Follow React hooks best practices 