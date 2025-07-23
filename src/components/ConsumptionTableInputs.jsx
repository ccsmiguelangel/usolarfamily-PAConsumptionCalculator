import { 
  Table, 
  NumberInput,
  Paper, 
  Title, 
  Grid,
  NumberFormatter ,
} from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import { useConsumption } from './ConsumptionContext';

import InflationSelector from './InflationSelector';

const ConsumptionTableInputs = () => {
  const {
    consumptions, handleInputChange,
    averageConsumption, averagePrice, averageMonthlyCost,
    totalConsumption, totalMonthlyCost
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
                  <NumberInput
                    value={row.cost}
                    onChange={(e) => handleInputChange(row.id, 'cost', Number(e))}
                    placeholder="Ingrese costo mensual"
                    allowDecimal={true}
                    leftSection="$"
                    hideControls 
                    type="number"
                  />
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
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averagePrice.toFixed(2)}/></Table.Td>
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={averageMonthlyCost.toFixed(2)} /></Table.Td>
              </Table.Tr>
                {/* Fila de totales */}
              <Table.Tr style={{ fontWeight: 'bold' }}>
                <Table.Td>TOTAL</Table.Td>
                <Table.Td><NumberFormatter thousandSeparator suffix=" kWh" value={totalConsumption.toFixed(2)} /></Table.Td>
                <Table.Td>-</Table.Td> {/* No se suma el precio */}
                <Table.Td><NumberFormatter thousandSeparator prefix="$ " value={typeof totalMonthlyCost === 'number' && !isNaN(totalMonthlyCost) ? totalMonthlyCost : 0} /></Table.Td>
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