import { useConsumption } from './ConsumptionContext';
import {
  Table,
  NumberInput,
  Paper,
  Title,
  Grid,
  Text,
  NumberFormatter,
} from '@mantine/core';

const SolarPanelCalculator = () => {
  const {
    panelWatts, setPanelWatts,
    filledConsumptions,
    systemSize,
    numberOfPanels
  } = useConsumption();

  return (
  <>
    <Grid.Col span={{ lg: 6, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Cálculo de Paneles Solares
        </Title>
        <NumberInput
          label="Ingrese los Watts por Panel (200W - 1000W)"
          placeholder="Watts por Panel"
          value={panelWatts}
          onChange={(value) => setPanelWatts(value)}
          min={200}
          max={1000}
          step={50}
          allowDecimal={false}
          hideControls
          rightSection="W"
          my="md"
        />
        {(!panelWatts || (panelWatts === 0) || !filledConsumptions) ? (
          <Text c="red" size="xl">
            Añade valor de mes faltante y los watts por panel.
          </Text>
        ) : (
          <Table.ScrollContainer type="native" minWidth={500} >
            <Table striped highlightOnHover withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>
                    Tamaño del sistema
                  </Table.Td>
                  <Table.Td>
                    Cantidad de paneles necesarios
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <Text size="lg" c="blue.4">
                      <NumberFormatter thousandSeparator suffix=" kWh" value={systemSize.toFixed(2)} />
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xl" c="green.4">
                      <NumberFormatter thousandSeparator value={numberOfPanels} />
                    </Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>
    </Grid.Col>
  </>
  )
}

export default SolarPanelCalculator;