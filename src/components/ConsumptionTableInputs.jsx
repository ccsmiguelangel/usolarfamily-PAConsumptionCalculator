import { 
  Table, 
  NumberInput,
  Paper, 
  Title, 
  Grid,
  NumberFormatter,
  Button,
  Tooltip
} from '@mantine/core';
import { IconBolt, IconTrash } from '@tabler/icons-react';
import { useConsumption } from './ConsumptionContext';

import InflationSelector from './InflationSelector';

const ConsumptionTableInputs = () => {
  const {
    consumptions, handleInputChange,
    averageConsumption, averagePrice, averageMonthlyCost,
    totalConsumption, totalMonthlyCost,

    quickCost, setQuickCost,
    quickConsumption, setQuickConsumption,
    fillAllMonthsWithQuickValues,
    clearAllMonths
  } = useConsumption();

  return(
  <>
    <Grid.Col span={12}>
      <Paper p="md"b withBorder>
        <Grid justify="space-between" align="center">
          <Grid.Col span="auto">
            <Title order={1} c="blue.9" display={{lg: 'block', base: 'none'}}>
              <IconBolt size={28} style={{ marginRight: 10 }} />
              Calculadora Energética
            </Title>
            <Title order={2} c="blue.9" display={{lg: 'none', base: 'block'}}>
              <IconBolt size={14} style={{ marginRight: 10 }} />
              Calculadora Energética
            </Title>
          </Grid.Col>
          <InflationSelector />
        </Grid>
      </Paper>
    </Grid.Col>

    <Grid.Col span={12}>
      <Paper p="md" mb="md" withBorder>
        <Title order={4} mb="sm">Llenado rápido de 12 meses</Title>
        <Grid gutter="md" align="end">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Consumo Mensual"
              value={quickConsumption}
              onChange={setQuickConsumption}
              min={0}
              hideControls
              rightSection="kWh"
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Costo mensual ($)"
              value={quickCost}
              onChange={setQuickCost}
              min={0}
              hideControls
              leftSection="$"
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Button color="blue" fullWidth onClick={fillAllMonthsWithQuickValues} style={{ height: 40 }}>
              Llenar 12 meses
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Tooltip label="Borrar todos los meses">
              <Button color="red" variant="light" fullWidth onClick={clearAllMonths} style={{ height: 40 }}>
                <IconTrash size={18} />
              </Button>
            </Tooltip>
          </Grid.Col>
        </Grid>
      </Paper>
    </Grid.Col>

    <Grid.Col span={12}>
      <Paper p="md" withBorder>
        <Table.ScrollContainer type="native" minWidth={500} >
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mes</Table.Th>
              <Table.Th>Consumo</Table.Th>
              <Table.Th>Costo Mensual</Table.Th>
              <Table.Th>Precio</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {consumptions.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.month}</Table.Td>
                
                <Table.Td>
                  <NumberInput
                    value={row.consumption}
                    onChange={(e) => handleInputChange(row.id, 'consumption', Number(e))}
                    rightSection="kWh"
                    hideControls 
                    placeholder="Ingrese consumo"
                    allowDecimal={false}
                  />
                </Table.Td>
                <Table.Td>
                  {row.id === 0 ? (
                    <NumberInput
                      value={row.cost}
                      onChange={(e) => handleInputChange(row.id, 'cost', Number(e))}
                      placeholder="Ingrese costo mensual"
                      allowDecimal={true}
                      leftSection="$"
                      hideControls 
                      type="number"
                    />
                  ) : (
                    <NumberInput
                      value={row.cost}
                      disabled
                      allowDecimal={true}
                      leftSection="$"
                      hideControls 
                      type="number"
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  <NumberFormatter thousandSeparator prefix="$ " value={row.price.toFixed(2)}/>
                </Table.Td>
              </Table.Tr>
            ))}
              {/* Fila de promedios */}
              <Table.Tr style={{ fontWeight: 'bold' }}>
                <Table.Td>PROMEDIO</Table.Td>
                <Table.Td><NumberFormatter thousandSeparator suffix=" kWh" value={averageConsumption.toFixed(2)}/></Table.Td>
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averageMonthlyCost.toFixed(2)} /></Table.Td>
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averagePrice.toFixed(2)}/></Table.Td>
              </Table.Tr>
                {/* Fila de totales */}
              <Table.Tr style={{ fontWeight: 'bold' }}>
                <Table.Td>TOTAL</Table.Td>
                <Table.Td><NumberFormatter thousandSeparator suffix=" kWh" value={totalConsumption.toFixed(2)} /></Table.Td>
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={typeof totalMonthlyCost === 'number' && !isNaN(totalMonthlyCost.toFixed(2)) ? totalMonthlyCost.toFixed(2) : 0} /></Table.Td>
                <Table.Td>-</Table.Td> {/* No se suma el precio */}
              </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      </Paper>
    </Grid.Col>
  </>
  )
}

export default ConsumptionTableInputs;