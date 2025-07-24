import { useConsumption } from './ConsumptionContext';
import { 
  Select, 
  Grid,
} from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';

const InflationSelector = () => {
  const { selectedRate, setSelectedRate } = useConsumption();
  return(
    <>
      <Grid.Col span={4}>
        <Select
          label="Escenario de inflación"
          value={selectedRate}
          onChange={setSelectedRate}
          data={[
            { value: '2', label: 'Inflación PA 2%' },
            { value: '3', label: 'Inflación PA 3%' },
            { value: '4', label: 'Inflación PA 4%' },
            { value: '5', label: 'Inflación PA 5%' },
            { value: '6', label: 'Inflación PA 6%' }
          ]}
          defaultValue={[{ value: '4', label: 'Inflación PA 4%' }]}
          leftSection={<IconChartLine size={18} />}
        />
      </Grid.Col>
    </>
  )
}

export default InflationSelector;