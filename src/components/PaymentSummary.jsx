import { useConsumption } from './ConsumptionContext';
import {
  Table,
  Text,
  NumberFormatter,
} from '@mantine/core';

const PaymentSummary = () => {
  const { 
    totalNaturgyEnsa, 
    totalNewProjection,
    totalNaturgyEnsaWithBattery,
    totalNewProjectionWithBattery,
    wantsBattery,
    systemTotalPrice,
    systemTotalPriceAdjusted,
    batteryPrice
  } = useConsumption();

  // Determinar qué totales usar basado en si la batería está activa
  const totalNaturgyEnsaToShow = wantsBattery ? totalNaturgyEnsaWithBattery : totalNaturgyEnsa;
  const totalNewProjectionToShow = wantsBattery ? totalNewProjectionWithBattery : totalNewProjection;
  
  // Determinar qué precio total usar para el cálculo del ahorro
  // Usar el precio sin impuestos (igual que arriba)
  const totalSystemPrice = wantsBattery ? 
    (systemTotalPriceAdjusted + batteryPrice) : 
    (systemTotalPriceAdjusted || systemTotalPrice);

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
                  <NumberFormatter thousandSeparator prefix="$ " value={totalNaturgyEnsaToShow.toFixed(2)} />
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="xl" c="green.4">
                <NumberFormatter thousandSeparator prefix="$ " value={(totalNaturgyEnsaToShow - totalSystemPrice).toFixed(2)} />
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