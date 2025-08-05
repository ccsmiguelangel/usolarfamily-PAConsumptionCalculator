import { useConsumption } from './ConsumptionContext';
import { 
  Container, 
  Grid
} from '@mantine/core';

import HeaderSection from './HeaderSection';
import ConsumptionTableInputs from './ConsumptionTableInputs';
import NaturgyProjectionChart from './NaturyProjectionChart';
import NewProjectionChart from './NewProjectionChart';
import SolarPanelCalculator from './SolarPanelCalculator';
import PaymentSummary from './PaymentSummary';
import RoofPanelCalculator from './RoofPanelCalculator'
import ClientInfoForm from './ClientInfoForm';

const ConsumptionTable = () => {
  const consumptionData = useConsumption();
  
  // Extraer valores de manera segura con valores por defecto
  const {
    totalNaturgyEnsa = 0,
    totalNewProjection = 0
  } = consumptionData || {};

  return (
    <Container size="xl" p="md">
      <HeaderSection />
      <Grid gutter="xl">
        <ConsumptionTableInputs />
        <SolarPanelCalculator />
        <RoofPanelCalculator />
        <NewProjectionChart />
        <NaturgyProjectionChart />
        <ClientInfoForm />
      </Grid>
    </Container>
  );
};

export default ConsumptionTable;