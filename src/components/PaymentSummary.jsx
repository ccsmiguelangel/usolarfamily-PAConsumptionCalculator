import { useConsumption } from './ConsumptionContext';
import {
  Table,
  Text,
  NumberFormatter,
} from '@mantine/core';

const PaymentSummary = () => {
  const { totalNaturgyEnsa300Months, totalNewProjection } = useConsumption();

  return (
    <>
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
                  <NumberFormatter thousandSeparator prefix="$ " value={totalNaturgyEnsa300Months.toFixed(2)} />
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="xl" c="green.4">
                <NumberFormatter thousandSeparator prefix="$ " value={(totalNaturgyEnsa300Months - totalNewProjection).toFixed(2)} />
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