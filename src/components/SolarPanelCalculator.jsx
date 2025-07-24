import { useConsumption } from './ConsumptionContext';
import {
  Table,
  NumberInput,
  Paper,
  Title,
  Grid,
  Alert,
  Text,
  NumberFormatter,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const SolarPanelCalculator = () => {
  const {
    panelWatts, setPanelWatts,
    filledConsumptions,
    systemSize,
    numberOfPanels,
    systemTotalPrice,
    systemPriceMultiplier, setSystemPriceMultiplier,
    systemTotalPriceAdjusted
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
        <NumberInput
          label="Ajuste de precio por watt del sistema (%)"
          description="Puedes aumentar o disminuir el precio por watt total del sistema. Ejemplo: -0.2 = -20%. Por defecto es el 1.45."
          value={systemPriceMultiplier}
          onChange={(value) => setSystemPriceMultiplier(Math.max(Number(value), -0.45))}
          min={-0.4}
          max={1}
          step={0.01}
          hideControls
          rightSection="%"
          my="md"
          precision={2}
        />
        {(!panelWatts || (panelWatts === 0) || !filledConsumptions) ? (
          <Alert color="red" icon={<IconAlertTriangle size={18} />}>
            Añade valor de mes faltante y los watts por panel.
          </Alert>
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
                  <Table.Td>
                    Precio Total del Sistema Aproximado
                  </Table.Td>
                  {(systemPriceMultiplier || (systemPriceMultiplier !== 0)) ? (
                  <Table.Td>
                    Precio Total Ajustado
                  </Table.Td>
                  ): ''}

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
                  <Table.Td>
                    <Text size="lg" c="orange.6">
                      <NumberFormatter thousandSeparator prefix="$ " value={systemTotalPrice.toFixed(2)} />
                    </Text>
                  </Table.Td>
                  {(systemPriceMultiplier || (systemPriceMultiplier !== 0)) ? (
                    <Table.Td>
                      <Text size="lg" c="orange.8">
                        <NumberFormatter thousandSeparator prefix="$ " value={systemTotalPriceAdjusted.toFixed(2)} />
                      </Text>
                    </Table.Td>
                  ): ''}

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