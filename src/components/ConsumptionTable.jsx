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
import ClientInfoForm from './ClientInfoForm';
const ConsumptionTable = () => {
  const {
    totalNaturgyEnsa,
    totalNewProjection
  } = useConsumption();

  return (
    <Container size="xl" p="md">
      <HeaderSection />
      <Grid gutter="xl">
        <ConsumptionTableInputs />
        <SolarPanelCalculator />
        <NaturgyProjectionChart />
        {/* <NewProjectionChart /> */}
              {(totalNaturgyEnsa > 0 || totalNewProjection > 0) && (
         <PaymentSummary />
        )}
        <ClientInfoForm />
      </Grid>
    </Container>
  );
};

export default ConsumptionTable;