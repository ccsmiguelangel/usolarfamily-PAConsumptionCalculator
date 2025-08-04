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
    consumptionCoveragePercentage,
    systemTotalPrice,
    systemPriceMultiplier, setSystemPriceMultiplier,
    systemTotalPriceAdjusted,
    additionalPanels, setAdditionalPanels,
    totalPanelsWithAdjustment,
    totalPanelsWatts,
    totalConsumption
  } = useConsumption();

  return (
  <>
    <Grid.Col span={{ lg: 7, base: 12 }}>
      <Paper p="md" withBorder>
        <Title order={2} mb="md" c="blue.9">
          Cálculo de Paneles Solares
        </Title>
        <Grid gutter="md" align="end">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Ajuste de precio por watt del sistema"
              description="Puedes aumentar o disminuir el precio por watt total del sistema. Ejemplo: 0.2"
              placeholder="Ej: 0.2"
              value={systemPriceMultiplier}
              onChange={(value) => setSystemPriceMultiplier(Math.max(Number(value), -0.3))}
              min={-0.3}
              max={1}
              step={0.01}
              hideControls
              rightSection="$"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Ingrese los Watts por Panel"
              description="200W - 1000W"
              placeholder="Watts por Panel"
              value={panelWatts}
              onChange={(value) => setPanelWatts(value)}
              min={200}
              max={1000}
              step={50}
              allowDecimal={false}
              hideControls
              rightSection="W"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Añadir/Quitar Paneles"
              description="Número positivo para añadir, negativo para quitar paneles"
              placeholder="Ej: 2 o -1"
              value={additionalPanels}
              onChange={(value) => setAdditionalPanels(Number(value) || 0)}
              min={-numberOfPanels}
              max={50}
              step={1}
              allowDecimal={false}
              hideControls
              my="md"
            />
          </Grid.Col>
        </Grid>
        {(!panelWatts || (Number(panelWatts) === 0) || !filledConsumptions) ? (
          <Alert color="red" icon={<IconAlertTriangle size={18} />}>
            Añade valor de mes faltante y los watts por panel.
          </Alert>
        ) : (
          <Table.ScrollContainer type="native" minWidth={500} >
            <Table striped highlightOnHover withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>
                    Tamaño del sistema según consumo
                  </Table.Td>
                  <Table.Td>
                    Cantidad de paneles necesarios
                  </Table.Td>
                  
           
                  {(systemPriceMultiplier && (Number(systemPriceMultiplier) !== 0)) ? (
                  <Table.Td>
                    Precio Total Ajustado
                  </Table.Td>
                  ): (
                    <Table.Td>
                      Precio Total
                    </Table.Td>
                  )}

                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <Text size="lg" c="blue.4">
                      <NumberFormatter thousandSeparator suffix=" kW" value={systemSize.toFixed(2)} />
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xl" c="green.4">
                      <NumberFormatter thousandSeparator value={totalPanelsWithAdjustment} />
                    </Text>
                    {Number(additionalPanels) !== 0 && (
                      <Text size="sm" c="gray.6">
                        (Base: {numberOfPanels} + Ajuste: {Number(additionalPanels) > 0 ? '+' : ''}{additionalPanels})
                      </Text>
                    )}
                    <Text size="sm" c="blue.6">
                      Cobertura: {consumptionCoveragePercentage.toFixed(1)}% del consumo anual
                    </Text>
                    <Text size="xs" c="gray.5">
                      Con {totalPanelsWatts.toFixed(3)} kW total de paneles
                    </Text>
                  </Table.Td>
                  
                  {(systemPriceMultiplier && (Number(systemPriceMultiplier) !== 0)) ? (
                    <Table.Td>
                      <Text size="lg" c="orange.8">
                        <NumberFormatter thousandSeparator prefix="$ " value={systemTotalPriceAdjusted.toFixed(2)} />
                      </Text>
                    </Table.Td>
                  ): (
                  <Table.Td>
                    <Text size="lg" c="orange.6">
                      <NumberFormatter thousandSeparator prefix="$ " value={systemTotalPrice.toFixed(2)} />
                    </Text>
                  </Table.Td>
                )}

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