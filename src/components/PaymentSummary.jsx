import { useConsumption } from './ConsumptionContext';
import {
  Table,
  Paper,
  Title,
  Grid,
  Text,
  NumberFormatter,
} from '@mantine/core';

const PaymentSummary = () => {
  const { totalNaturgyEnsa150Months, totalNewProjection150Months } = useConsumption();

  return (
    <>
      {/* <Title order={2} mb="md" c="blue.9">Resumen de Pagos en 25 años</Title> */}
      <Table.ScrollContainer type="native" minWidth={500} mt="xl" >
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Td>
                Total Gastado en Naturgy | Ensa
              </Table.Td>
              <Table.Td>
                Total Ahorrado en Nueva Proyección
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Text size="xl" c="red.4">
                  <NumberFormatter thousandSeparator prefix="$ " value={totalNaturgyEnsa150Months.toFixed(2)} />
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="xl" c="green.4">
                  <NumberFormatter thousandSeparator prefix="$ " value={(totalNaturgyEnsa150Months - totalNewProjection150Months).toFixed(2)} />
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}

export default PaymentSummary;